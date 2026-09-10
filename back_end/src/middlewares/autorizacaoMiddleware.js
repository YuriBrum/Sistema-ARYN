function autorizar(...tiposPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message:
                    'Usuário não autenticado.'
            });
        }

        if (
            !tiposPermitidos.includes(
                req.usuario.tipo
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Você não possui permissão para acessar este recurso.'
            });
        }

        next();
    };
}

module.exports = autorizar;