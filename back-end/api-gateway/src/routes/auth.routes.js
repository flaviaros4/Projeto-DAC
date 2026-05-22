const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {

    if(req.body.email && req.body.senha) {

        const id = 1;

        const token = jwt.sign(
            { id },
            process.env.JWT_SECRET,
            {
                expiresIn: 300
            }
        );

        return res.json({
            auth: true,
            token: token
        });
    }

    return res.status(400).json({
        message: 'Email e senha são obrigatórios'
    });
});

router.post('/logout', (req, res) => {

    return res.json({
        auth: false,
        token: null
    });
});

module.exports = router;