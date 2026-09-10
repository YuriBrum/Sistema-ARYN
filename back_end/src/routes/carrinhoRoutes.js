const express = require('express');

const router =
    express.Router();

const autenticar =
    require('../middlewares/authMiddleware');

const carrinhoController =
    require('../controllers/carrinhoController');

router.use(autenticar);

router.get(
    '/',
    carrinhoController.obterCarrinho
);

router.post(
    '/itens',
    carrinhoController.adicionarItem
);

router.patch(
    '/itens/:id',
    carrinhoController.atualizarItem
);

router.delete(
    '/itens/:id',
    carrinhoController.removerItem
);

router.delete(
    '/',
    carrinhoController.limparCarrinho
);

module.exports = router;