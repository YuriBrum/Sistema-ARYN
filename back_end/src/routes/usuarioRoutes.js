const express = require('express');

const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', UsuarioController.listarTodos);

router.get('/:id', UsuarioController.buscarPorId);

router.post('/', UsuarioController.criar);

module.exports = router;