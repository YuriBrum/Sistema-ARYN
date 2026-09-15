const express = require('express');

const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

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


// GET /api/pedidos
router.get(
    '/',
    autenticar,
    autorizar('admin'),
    validarPaginacao,
    pedidoController.listarTodos
);


// GET /api/pedidos/:id
router.get(
    '/:id',
    autenticar,
    validarId('id'),
    pedidoController.buscarPorId
);


// POST /api/pedidos
router.post(
    '/',
    autenticar,
    validarBody,
    validarCamposObrigatorios([
        'id_cliente'
    ]),
    pedidoController.criar
);


// PUT /api/pedidos/:id
router.put(
    '/:id',
    autenticar,
    validarId('id'),
    validarBody,
    pedidoController.atualizar
);


// DELETE /api/pedidos/:id
router.delete(
    '/:id',
    autenticar,
    autorizar('admin'),
    validarId('id'),
    pedidoController.excluir
);


module.exports = router;