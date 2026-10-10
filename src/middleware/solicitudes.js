const crypto = require(`crypto`);

const identificarSolicitud = (req, res, next) => {
    req.solicitudId = crypto.randomUUID();
    res.setHeader(`X-Solicitud-ID`, req.solicitudId);
    next();
};

const medirDuracion = (req, res, next) => {
    const inicio = process.hrtime.bigint();
    res.on(`finish`, () => {
        const milisegundos = Number(process.hrtime.bigint() - inicio) / 1_000_000;
        console.log(`Solicitud ${req.solicitudId} completada en ${milisegundos.toFixed(2)} ms`);
    });
    next();
};

module.exports = {identificarSolicitud, medirDuracion};
