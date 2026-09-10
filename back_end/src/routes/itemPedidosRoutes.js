const express = require('express');

const router = express.Router();

const itemPedidoController = require('../controllers/itemPedidoController');

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


// GET /api/itens-pedido
router.get(
    '/',
    autenticar,
    autorizar('admin'),
    validarPaginacao,
    itemPedidoController.listarTodos
);


// GET /api/itens-pedido/pedido/:idPedido
router.get(
    '/pedido/:idPedido',
    autenticar,
    validarId('idPedido'),
    itemPedidoController.listarPorPedido
);


// GET /api/itens-pedido/:id
router.get(
    '/:id',
    autenticar,
    validarId('id'),
    itemPedidoController.buscarPorId
);


// POST /api/itens-pedido
router.post(
    '/',
    autenticar,
    validarBody,
    validarCamposObrigatorios([
        'id_pedido',
        'id_produto',
        'quantidade'
    ]),
    itemPedidoController.criar
);


// PUT /api/itens-pedido/:id
router.put(
    '/:id',
    autenticar,
    validarId('id'),
    validarBody,
    validarCamposObrigatorios([
        'id_pedido',
        'id_produto',
        'quantidade'
    ]),
    itemPedidoController.atualizar
);


// DELETE /api/itens-pedido/:id
router.delete(
    '/:id',
    autenticar,
    validarId('id'),
    itemPedidoController.excluir
);


module.exports = router;