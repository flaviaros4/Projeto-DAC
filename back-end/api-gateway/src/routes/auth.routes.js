const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(
            `${process.env.AUTH_SERVICE}/login`,
            req.body,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return res.json(response.data);
    } catch (error) {
        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || { message: 'Erro no serviço de autenticação' }
        );
    }
});

router.post('/logout', async (req, res) => {
    try {
        const response = await axios.post(
            `${process.env.AUTH_SERVICE}/logout`,
            {},
            { headers: { 'Authorization': req.headers['authorization'] } }
        );
        return res.json(response.data);
    } catch (error) {
        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || { message: 'Erro no logout' }
        );
    }
});

module.exports = router;