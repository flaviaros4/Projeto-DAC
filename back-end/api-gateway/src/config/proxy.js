const httpProxy = require('express-http-proxy');

const authProxy = httpProxy(process.env.AUTH_SERVICE, {
  proxyReqPathResolver: req => req.originalUrl
});

const gerenteProxy = httpProxy(process.env.GERENTE_SERVICE, {
  proxyReqPathResolver: req => req.originalUrl
});

const clienteProxy = httpProxy(process.env.CLIENTE_SERVICE, {
  proxyReqPathResolver: req => req.originalUrl
});

const contaProxy = httpProxy(process.env.CONTA_SERVICE, {
  proxyReqPathResolver: req => req.originalUrl
});

module.exports = {
  authProxy,
  gerenteProxy,
  clienteProxy,
  contaProxy
};