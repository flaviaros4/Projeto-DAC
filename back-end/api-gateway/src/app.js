const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const { verifyJWT } = require('./middlewares/auth');
const { authProxy, gerenteProxy, clienteProxy, contaProxy } = require('./config/proxy');

const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());


app.use('/', authRouter); 
app.use('/gerentes', verifyJWT, gerenteProxy);
app.use('/clientes', verifyJWT, clienteProxy);
app.use('/contas', verifyJWT, contaProxy);



app.get('/teste', verifyJWT, (req, res) => {
    res.json({
        message: 'Token válido',
        userId: req.userId
    });
});


module.exports = app;