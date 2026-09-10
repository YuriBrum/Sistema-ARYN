const express = require('express');

const authController =
    require('../controllers/authController');

const autenticar =
    require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
    '/cadastro',
    authController.cadastro
);

router.post(
    '/login',
    authController.login
);

router.get(
    '/perfil',
    autenticar,
    authController.perfil
);

module.exports = router;