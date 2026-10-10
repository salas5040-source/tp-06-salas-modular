function establecerSeccion(req, res, next) {
  res.locals.section = 'reservas de salas';
  next();
}

function crearMiddlewareValidacion(servicioReservas) {
  return function validarReserva(req, res, next) {
    let { estudiante, email, sala, fecha, turno, personas } = req.body;

    estudiante = estudiante?.trim();
    email = email?.trim();
    sala = sala?.trim();
    fecha = fecha?.trim();
    turno = turno?.trim();
    const cantPersonas = Number(personas);

    const errores = [];
    const salasPermitidas = servicioReservas.obtenerSalasPermitidas();
    const turnosPermitidos = servicioReservas.obtenerTurnosPermitidos();

    if (!estudiante) errores.push('El nombre del estudiante es obligatorio.');
    if (!email || !email.includes('@')) errores.push("Debe ingresar un email válido que contenga '@'.");
    if (!salasPermitidas.includes(sala)) errores.push('La sala seleccionada no es válida.');
    if (!fecha) errores.push('La fecha es obligatoria.');
    if (!turnosPermitidos.includes(turno)) errores.push('El turno seleccionado no es válido.');
    if (isNaN(cantPersonas) || !Number.isInteger(cantPersonas) || cantPersonas < 1 || cantPersonas > 6) {
      errores.push('La cantidad de personas debe ser un número entero entre 1 y 6.');
    }

    if (errores.length > 0) {
      return res.status(400).render('reservas/nueva', {
        errores,
        valoresPrevios: req.body,
      });
    }

    req.reservaValida = {
      estudiante: estudiante.trim(),
      email: email.trim(),
      sala: sala.trim(),
      fecha: fecha.trim(),
      turno: turno.trim(),
      personas: cantPersonas,
    };

    next();
  };
}

module.exports = { establecerSeccion, crearMiddlewareValidacion };