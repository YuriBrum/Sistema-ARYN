const express = require('express');

const router = express.Router();

const autenticar =
    require('../middlewares/authMiddleware');

const favoritoController =
    require('../controllers/favoritoController');


// Todas as operações exigem autenticação.

router.use(autenticar);


// Listar favoritos

router.get(
    '/',
    favoritoController.listarFavoritos
);


// Adicionar favorito

router.post(
    '/',
    favoritoController.adicionarFavorito
);


// Remover favorito

router.delete(
    '/:produtoId',
    favoritoController.removerFavorito
);


// Verificar favorito

router.get(
    '/:produtoId/verificar',
    favoritoController.verificarFavorito
);


module.exports = router;