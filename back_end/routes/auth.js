const express = require('express');
const { cadastro, login, perfil } = require('../controllers/authApiController');
const { autenticar } = require('../src/middlewares/authMiddleware');

const router = express.Router();
router.post('/register', cadastro);
router.post('/cadastro', cadastro);
router.post('/login', login);
router.get('/perfil', autenticar, perfil);
router.post('/logout', (_req, res) => res.json({ success: true, message: 'Logout realizado com sucesso.' }));

module.exports = router;
