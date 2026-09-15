const express = require('express');

const estoqueController =
    require('../controllers/estoqueController');

const router = express.Router();

router.get(
    '/movimentacoes',
    estoqueController.listarMovimentacoes
);

router.get(
    '/:id_variacao',
    estoqueController.consultarEstoque
);

router.post(
    '/movimentar',
    estoqueController.movimentarEstoque
);

module.exports = router;