const express = require('express');
const { establecerSeccion, crearMiddlewareValidacion } = require('../middleware/reservas');

function crearRouterReservas(controladorReservas, servicioReservas) {
  const router = express.Router();
  const validarReserva = crearMiddlewareValidacion(servicioReservas);

  router.use(establecerSeccion);

  router.get('/', controladorReservas.listar);
  router.get('/nueva', controladorReservas.mostrarFormulario);
  router.get('/:id', controladorReservas.verDetalle);
  router.post('/', validarReserva, controladorReservas.crear);

  return router;
}

module.exports = { crearRouterReservas };