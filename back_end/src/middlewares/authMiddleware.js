const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticação não informado.'
            });
        }

        const partes = authorization.split(' ');

        if (
            partes.length !== 2 ||
            partes[0] !== 'Bearer'
        ) {
            return res.status(401).json({
                success: false,
                message:
                    'Formato do token inválido. Use: Bearer TOKEN.'
            });
        }

        const token = partes[1];

        const segredo = process.env.JWT_SECRET;

        if (!segredo) {
            console.error(
                'JWT_SECRET não configurado no arquivo .env'
            );

            return res.status(500).json({
                success: false,
                message:
                    'Configuração de autenticação não encontrada.'
            });
        }

        const usuario = jwt.verify(token, segredo);

        req.usuario = usuario;

        next();

    } catch (error) {
        console.error('Erro de autenticação:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Não autorizado.'
        });
    }
}


function autorizar(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado.'
            });
        }

        if (perfisPermitidos.length === 0) {
            return next();
        }

        const perfil =
            req.usuario.perfil ||
            req.usuario.tipo_usuario ||
            req.usuario.tipo;

        if (!perfisPermitidos.includes(perfil)) {
            return res.status(403).json({
                success: false,
                message:
                    'Você não possui permissão para realizar esta operação.'
            });
        }

        next();
    };
}


module.exports = {
    autenticar,
    autorizar
};