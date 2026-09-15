const express = require('express');

const ProdutoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', ProdutoController.listarTodos);

router.get(
    '/categoria/:idCategoria',
    ProdutoController.listarPorCategoria
);

router.get('/:id', ProdutoController.buscarPorId);

module.exports = router;