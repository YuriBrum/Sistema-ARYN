const express = require('express');

const enderecoController =
    require('../controllers/enderecoController');

const autenticar =
    require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get(
    '/',
    enderecoController.listarEnderecos
);

router.get(
    '/:id',
    enderecoController.buscarEndereco
);

router.post(
    '/',
    enderecoController.criarEndereco
);

router.put(
    '/:id',
    enderecoController.atualizarEndereco
);

router.patch(
    '/:id/principal',
    enderecoController.definirPrincipal
);

router.delete(
    '/:id',
    enderecoController.excluirEndereco
);

module.exports = router;