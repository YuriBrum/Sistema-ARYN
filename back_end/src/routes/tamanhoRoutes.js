const express = require('express');

const tamanhoController = require('../controllers/tamanhoController');

const router = express.Router();

router.get('/', tamanhoController.listarTamanhos);
router.get('/:id', tamanhoController.buscarTamanhoPorId);
router.post('/', tamanhoController.criarTamanho);
router.put('/:id', tamanhoController.atualizarTamanho);
router.delete('/:id', tamanhoController.excluirTamanho);

module.exports = router;