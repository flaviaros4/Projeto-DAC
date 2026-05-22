const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não fornecido'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token inválido'
        });
    }

    const token = authHeader.substring(7);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                message: 'Token inválido'
            });
        }

        req.userId = decoded.id;

        next();
    });
}

module.exports = { verifyJWT };