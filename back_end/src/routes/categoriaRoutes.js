const express = require('express');

const CategoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.get('/', CategoriaController.listarTodas);

router.get('/:id', CategoriaController.buscarPorId);

router.post('/', CategoriaController.criar);

module.exports = router;