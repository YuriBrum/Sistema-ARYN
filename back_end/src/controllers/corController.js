const corModel = require('../models/corModel');

async function listarCores(req, res) {
    try {
        const cores = await corModel.listarCores();

        return res.status(200).json({
            success: true,
            data: cores
        });
    } catch (error) {
        console.error('Erro ao listar cores:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao listar cores.'
        });
    }
}

async function buscarCorPorId(req, res) {
    try {
        const { id } = req.params;

        const cor = await corModel.buscarCorPorId(id);

        if (!cor) {
            return res.status(404).json({
                success: false,
                message: 'Cor não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            data: cor
        });
    } catch (error) {
        console.error('Erro ao buscar cor:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar cor.'
        });
    }
}

async function criarCor(req, res) {
    try {
        const { nome, codigo_hex } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome da cor é obrigatório.'
            });
        }

        const cor = await corModel.criarCor(
            nome.trim(),
            codigo_hex
        );

        return res.status(201).json({
            success: true,
            message: 'Cor criada com sucesso.',
            data: cor
        });
    } catch (error) {
        console.error('Erro ao criar cor:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe uma cor com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao criar cor.'
        });
    }
}

async function atualizarCor(req, res) {
    try {
        const { id } = req.params;
        const { nome, codigo_hex, status } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome da cor é obrigatório.'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'O campo status deve ser booleano.'
            });
        }

        const cor = await corModel.atualizarCor(
            id,
            nome.trim(),
            codigo_hex,
            status
        );

        if (!cor) {
            return res.status(404).json({
                success: false,
                message: 'Cor não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cor atualizada com sucesso.',
            data: cor
        });
    } catch (error) {
        console.error('Erro ao atualizar cor:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe uma cor com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao atualizar cor.'
        });
    }
}

async function excluirCor(req, res) {
    try {
        const { id } = req.params;

        const excluida = await corModel.excluirCor(id);

        if (!excluida) {
            return res.status(404).json({
                success: false,
                message: 'Cor não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cor excluída com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao excluir cor:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir esta cor porque existem variações de produtos vinculadas a ela.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao excluir cor.'
        });
    }
}

module.exports = {
    listarCores,
    buscarCorPorId,
    criarCor,
    atualizarCor,
    excluirCor
};