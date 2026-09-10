const express = require('express');

const router = express.Router();

const produtoController = require('../controllers/produtoController');

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


// GET /api/produtos
router.get(
    '/',
    validarPaginacao,
    produtoController.listarTodos
);


// GET /api/produtos/categoria/:idCategoria
router.get(
    '/categoria/:idCategoria',
    validarId('idCategoria'),
    produtoController.listarPorCategoria
);


// GET /api/produtos/:id
router.get(
    '/:id',
    validarId('id'),
    produtoController.buscarPorId
);


// POST /api/produtos
router.post(
    '/',
    autenticar,
    autorizar('admin'),
    validarBody,
    validarCamposObrigatorios([
        'nome',
        'preco',
        'quantidade',
        'id_categoria'
    ]),
    produtoController.criar
);


// PUT /api/produtos/:id
router.put(
    '/:id',
    autenticar,
    autorizar('admin'),
    validarId('id'),
    validarBody,
    validarCamposObrigatorios([
        'nome',
        'preco',
        'quantidade',
        'id_categoria'
    ]),
    produtoController.atualizar
);


// DELETE /api/produtos/:id
router.delete(
    '/:id',
    autenticar,
    autorizar('admin'),
    validarId('id'),
    produtoController.excluir
);


module.exports = router;