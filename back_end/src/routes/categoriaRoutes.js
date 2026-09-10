const express = require('express');

const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const {
    validarId,
    validarBody,
    validarCamposObrigatorios
} = require('../middleware/validationMiddleware');

const {
    autenticar,
    autorizar
} = require('../middleware/authMiddleware');


// GET /api/categorias
router.get(
    '/',
    categoriaController.listarTodas
);


// GET /api/categorias/:id
router.get(
    '/:id',
    validarId('id'),
    categoriaController.buscarPorId
);


// POST /api/categorias
router.post(
    '/',
    autenticar,
    autorizar('admin'),
    validarBody,
    validarCamposObrigatorios(['nome']),
    categoriaController.criar
);


// PUT /api/categorias/:id
router.put(
    '/:id',
    autenticar,
    autorizar('admin'),
    validarId('id'),
    validarBody,
    validarCamposObrigatorios(['nome']),
    categoriaController.atualizar
);


// DELETE /api/categorias/:id
router.delete(
    '/:id',
    autenticar,
    autorizar('admin'),
    validarId('id'),
    categoriaController.excluir
);


module.exports = router;