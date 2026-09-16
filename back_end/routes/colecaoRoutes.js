const express = require('express');
const controller = require('../controllers/colecaoController');

const router = express.Router();
router.get('/', controller.listarColecoes);
router.get('/:slug/produtos', controller.listarProdutosDaColecao);
router.get('/:slug', controller.buscarColecaoPorSlug);

module.exports = router;
