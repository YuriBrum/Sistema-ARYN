const express = require('express');
const { cadastro, login } = require('../controllers/authApiController');

const router = express.Router();
router.post('/register', cadastro);
router.post('/cadastro', cadastro);
router.post('/login', login);
router.post('/logout', (_req, res) => res.json({ success: true, message: 'Logout realizado com sucesso.' }));

module.exports = router;
