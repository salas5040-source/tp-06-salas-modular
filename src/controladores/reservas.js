function crearControladorReservas(servicioReservas) {
    return {
        mostrarInicio: (req, res) => {
            res.render('inicio', { titulo: 'Inicio - reserva de salas' });
        },
        obtenerReservas: (req, res) => {
            const reservas = servicioReservas.obtenerReservas();
            res.json({
                servicio: 'activo',
                reservas: reservas.length,
                solicitudId: res.locals.solicitudId
            });
        },
        listar: (req, res) => {
            res.render("reservas/lista", {
                titulo: "Reservas de salas",
                reservas: servicioReservas.obtenerReservas()
            });
        },
        mostrarFormulario: (req, res) => {
            res.render("reservas/nueva", {
                titulo: "Nueva reserva",
                salasPermitidas: salasPermitidas,
                turnosPermitidos: turnosPermitidos,
                errores: [],
                valores: {}
            });
        },
        verDetalle: (req, res) => {
            const id = Number(req.params.id);
            const reserva = servicioReservas.buscarReservaPorId(id);

            if (!reserva) {
                return res.status(404).render("no-encontrada", {
                    titulo: "Reserva no encontrada",
                    id: id,
                    mensaje: "reserva no encontrada"
                });
            }

            res.render("reservas/detalle", {
                titulo: "Detalle de reserva",
                reserva: reserva
            });
        },
        crear: (req, res) => {
            servicioReservas.crear(req.reservaValida);
            res.redirect("/reservas");
        },
    };
}

module.exports = { crearControladorReservas };
