const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const axios = require('axios');

router.post('/login', async (req, res) => {

    try {

        const response = await axios.post(
            `${process.env.AUTH_SERVICE}/login`,
            req.body
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: 'Erro no serviço de autenticação'
            }
        );
    }
});

router.post('/logout', (req, res) => {

    return res.json({
        auth: false,
        token: null
    });
});

module.exports = router;