const express = require('express');
const path = require(`node:path`);
const morgan = require('morgan');
const expressLayout = require('express-ejs-layouts');

const { identificarSolicitud, medirDuracion } = require('./middleware/solicitudes');
const { crearRouterReservas } = require('./rutas/reservas');

function crearApp({ servicioReservas, controladoresReservas, morganFormat }) {
    const app = express();

    app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  app.set('layout', 'layouts/main');

  app.use(morgan(morganFormat));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayout);
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/', controladorReservas.mostrarInicio);
  app.get('/estado', controladorReservas.obtenerEstado);

  const reservasRouter = crearRouterReservas(controladorReservas, servicioReservas);
  app.use('/reservas', reservasRouter);

  app.use((req, res) => {
    res.status(404).render(`no-encontrada`, {
        titulo: `pagina no encontrada`,
        mensaje: `la direccion solicitada no existe`,
    });
  });

  return app;
}

module.exports = { crearApp };