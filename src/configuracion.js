function obtenerConfiguracion() {
    const portRaw = process.env.PORT || '3000';
    const port = parseInt(portRaw, 10);

    if (Number.isNaN(port) || port <= 1 || port > 65535) {
        throw new Error(`El puerto ${portRaw} no es válido. Debe ser un número entre 1 y 65535.`);
    }

    const nodeEnv = process.env.NODE_ENV || `development`;
    const morganFormat = nodeEnv === `production` ? `combined` : `dev`;

    return { port, nodeEnv, morganFormat };
}

module.exports = { obtenerConfiguracion };