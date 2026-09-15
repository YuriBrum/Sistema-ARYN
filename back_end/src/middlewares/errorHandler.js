function errorHandler(err, req, res, next) {
    console.error('Erro:', err);

    // Erro de JSON inválido
    if (err instanceof SyntaxError && err.status === 400 && err.body) {
        return res.status(400).json({
            success: false,
            message: 'JSON inválido.'
        });
    }

    // Erro de chave duplicada do MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'Registro duplicado. Os dados informados já existem.'
        });
    }

    // Erro de chave estrangeira
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            success: false,
            message: 'Um dos registros relacionados não existe.'
        });
    }

    // Tentativa de excluir registro relacionado
    if (
        err.code === 'ER_ROW_IS_REFERENCED_2' ||
        err.code === 'ER_ROW_IS_REFERENCED'
    ) {
        return res.status(409).json({
            success: false,
            message:
                'Não é possível excluir este registro porque existem dados relacionados.'
        });
    }

    // Erro genérico
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor.'
    });
}

module.exports = errorHandler;