const express = require('express');

const router = express.Router();

const clienteController = require('../controllers/clienteController');

const {
    validarId,
    validarBody,
    validarCamposObrigatorios,
    validarPaginacao
} = require('../middleware/validationMiddleware');

const {
    autenticar,
    autorizar
} = require('../middleware/authMiddleware');


// GET /api/clientes
router.get(
    '/',
    autenticar,
    autorizar('admin'),
    validarPaginacao,
    clienteController.listarTodos
);


// GET /api/clientes/:id
router.get(
    '/:id',
    autenticar,
    validarId('id'),
    clienteController.buscarPorId
);


// POST /api/clientes
router.post(
    '/',
    validarBody,
    validarCamposObrigatorios([
        'nome',
        'email',
        'senha'
    ]),
    clienteController.criar
);


// PUT /api/clientes/:id
router.put(
    '/:id',
    autenticar,
    validarId('id'),
    validarBody,
    clienteController.atualizar
);


// DELETE /api/clientes/:id
router.delete(
    '/:id',
    autenticar,
    validarId('id'),
    clienteController.excluir
);


module.exports = router;