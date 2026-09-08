const categoriaModel = require('../models/categoriaModel');

async function listarCategorias(req, res) {
    try {
        const categorias = await categoriaModel.listarCategorias();

        return res.status(200).json({
            success: true,
            data: categorias
        });

    } catch (error) {
        console.error('Erro ao listar categorias:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao listar categorias.'
        });
    }
}

async function buscarCategoriaPorId(req, res) {
    try {
        const { id } = req.params;

        const categoria = await categoriaModel.buscarCategoriaPorId(id);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            data: categoria
        });

    } catch (error) {
        console.error('Erro ao buscar categoria:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar categoria.'
        });
    }
}

async function criarCategoria(req, res) {
    try {
        const { nome, descricao } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome da categoria é obrigatório.'
            });
        }

        const categoria = await categoriaModel.criarCategoria(
            nome.trim(),
            descricao
        );

        return res.status(201).json({
            success: true,
            message: 'Categoria criada com sucesso.',
            data: categoria
        });

    } catch (error) {
        console.error('Erro ao criar categoria:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe uma categoria com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao criar categoria.'
        });
    }
}

async function atualizarCategoria(req, res) {
    try {
        const { id } = req.params;
        const { nome, descricao, status } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome da categoria é obrigatório.'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'O campo status deve ser booleano.'
            });
        }

        const categoria = await categoriaModel.atualizarCategoria(
            id,
            nome.trim(),
            descricao,
            status
        );

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Categoria atualizada com sucesso.',
            data: categoria
        });

    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe uma categoria com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao atualizar categoria.'
        });
    }
}

async function excluirCategoria(req, res) {
    try {
        const { id } = req.params;

        const excluida = await categoriaModel.excluirCategoria(id);

        if (!excluida) {
            return res.status(404).json({
                success: false,
                message: 'Categoria não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Categoria excluída com sucesso.'
        });

    } catch (error) {
        console.error('Erro ao excluir categoria:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir esta categoria porque existem produtos vinculados a ela.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao excluir categoria.'
        });
    }
}

module.exports = {
    listarCategorias,
    buscarCategoriaPorId,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria
};