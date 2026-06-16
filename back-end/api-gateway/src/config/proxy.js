const httpProxy = require('express-http-proxy');

const proxyOptions = {
  proxyReqPathResolver: req => req.originalUrl,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.headers['authorization']) {
      proxyReqOpts.headers['authorization'] = srcReq.headers['authorization'];
    }
    return proxyReqOpts;
  }
};

const authProxy    = httpProxy(process.env.AUTH_SERVICE,    proxyOptions);
const gerenteProxy = httpProxy(process.env.GERENTE_SERVICE, proxyOptions);
const clienteProxy = httpProxy(process.env.CLIENTE_SERVICE, proxyOptions);
const contaProxy   = httpProxy(process.env.CONTA_SERVICE,   proxyOptions);

module.exports = { authProxy, gerenteProxy, clienteProxy, contaProxy };