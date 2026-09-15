const express = require('express');

const variacaoProdutoController =
    require('../controllers/variacaoProdutoController');

const router = express.Router();

router.get(
    '/',
    variacaoProdutoController.listarVariacoes
);

router.get(
    '/:id',
    variacaoProdutoController.buscarVariacaoPorId
);

router.post(
    '/',
    variacaoProdutoController.criarVariacao
);

router.put(
    '/:id',
    variacaoProdutoController.atualizarVariacao
);

router.delete(
    '/:id',
    variacaoProdutoController.excluirVariacao
);

module.exports = router;