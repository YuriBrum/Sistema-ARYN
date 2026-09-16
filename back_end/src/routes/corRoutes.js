const express = require('express');

const corController = require('../controllers/corController');

const router = express.Router();

router.get('/', corController.listarCores);
router.get('/:id', corController.buscarCorPorId);
router.post('/', corController.criarCor);
router.put('/:id', corController.atualizarCor);
router.delete('/:id', corController.excluirCor);

module.exports = router;