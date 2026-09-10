function validarId(parametro = 'id') {
    return (req, res, next) => {
        const valor = req.params[parametro];

        if (
            valor === undefined ||
            !/^\d+$/.test(String(valor)) ||
            Number(valor) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: `${parametro} inválido.`
            });
        }

        next();
    };
}


function validarBody(req, res, next) {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            success: false,
            message: 'O corpo da requisição é inválido.'
        });
    }

    next();
}


function validarCamposObrigatorios(campos = []) {
    return (req, res, next) => {
        const camposAusentes = [];

        for (const campo of campos) {
            const valor = req.body[campo];

            if (
                valor === undefined ||
                valor === null ||
                (typeof valor === 'string' && valor.trim() === '')
            ) {
                camposAusentes.push(campo);
            }
        }

        if (camposAusentes.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Existem campos obrigatórios ausentes.',
                campos: camposAusentes
            });
        }

        next();
    };
}


function validarPaginacao(req, res, next) {
    let { pagina = 1, limite = 10 } = req.query;

    pagina = Number(pagina);
    limite = Number(limite);

    if (
        !Number.isInteger(pagina) ||
        pagina < 1
    ) {
        return res.status(400).json({
            success: false,
            message: 'O parâmetro pagina deve ser um número inteiro maior que zero.'
        });
    }

    if (
        !Number.isInteger(limite) ||
        limite < 1 ||
        limite > 100
    ) {
        return res.status(400).json({
            success: false,
            message: 'O parâmetro limite deve estar entre 1 e 100.'
        });
    }

    req.paginacao = {
        pagina,
        limite,
        offset: (pagina - 1) * limite
    };

    next();
}


module.exports = {
    validarId,
    validarBody,
    validarCamposObrigatorios,
    validarPaginacao
};