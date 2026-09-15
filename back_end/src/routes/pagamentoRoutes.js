const express = require('express');

const router = express.Router();

const autenticar =
    require('../middlewares/authMiddleware');

const pagamentoController =
    require('../controllers/pagamentoController');


router.use(autenticar);


// Listar pagamentos

router.get(
    '/',
    pagamentoController.listarPagamentos
);


// Visualizar pagamento

router.get(
    '/:id',
    pagamentoController.obterPagamento
);


// Atualizar pagamento

router.patch(
    '/:id',
    pagamentoController.atualizarPagamento
);


module.exports = router;