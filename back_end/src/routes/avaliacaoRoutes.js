const express = require('express');

const router = express.Router();

const avaliacaoController = require('../controllers/avaliacaoController');

const {
    validarId,
    validarBody,
    validarCamposObrigatorios,
    validarPaginacao
} = require('../middleware/validationMiddleware');

const {
    autenticar
} = require('../middleware/authMiddleware');


// GET /api/avaliacoes
router.get(
    '/',
    validarPaginacao,
    avaliacaoController.listarTodas
);


// GET /api/avaliacoes/produto/:idProduto
router.get(
    '/produto/:idProduto',
    validarId('idProduto'),
    avaliacaoController.listarPorProduto
);


// GET /api/avaliacoes/:id
router.get(
    '/:id',
    validarId('id'),
    avaliacaoController.buscarPorId
);


// POST /api/avaliacoes
router.post(
    '/',
    autenticar,
    validarBody,
    validarCamposObrigatorios([
        'id_cliente',
        'id_produto',
        'nota'
    ]),
    avaliacaoController.criar
);


// PUT /api/avaliacoes/:id
router.put(
    '/:id',
    autenticar,
    validarId('id'),
    validarBody,
    validarCamposObrigatorios([
        'nota'
    ]),
    avaliacaoController.atualizar
);


// DELETE /api/avaliacoes/:id
router.delete(
    '/:id',
    autenticar,
    validarId('id'),
    avaliacaoController.excluir
);


module.exports = router;