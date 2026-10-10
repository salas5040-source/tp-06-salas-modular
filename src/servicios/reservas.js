function crearServicioReserva(datosIniciales = []) {
    const reservas = [...datosIniciales];

    return {
        obtenerReservas: () => [...reservas],
        buscarReservaPorId: (id) => reservas.find((r) => r.id === id),
        obtenerCantidad: () => reservas.length,
        crear: (datos) => {
            const nuevaReserva = {
                id: `BIB-${Date.now()}`,
                ...datos
            };
            reservas.push(nuevaReserva);
            return nuevaReserva;
        },
    };
}

module.exports = { crearServicioReserva
};