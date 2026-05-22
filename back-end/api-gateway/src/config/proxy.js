const httpProxy = require('express-http-proxy');

const authProxy = httpProxy(process.env.AUTH_SERVICE);
const gerenteProxy = httpProxy(process.env.GERENTE_SERVICE);
const clienteProxy = httpProxy(process.env.CLIENTE_SERVICE);
const contaProxy = httpProxy(process.env.CONTA_SERVICE);

module.exports = { authProxy, gerenteProxy, clienteProxy, contaProxy };

