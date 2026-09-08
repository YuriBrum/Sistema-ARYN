const tamanhoModel = require('../models/tamanhoModel');

async function listarTamanhos(req, res) {
    try {
        const tamanhos = await tamanhoModel.listarTamanhos();

        return res.status(200).json({
            success: true,
            data: tamanhos
        });
    } catch (error) {
        console.error('Erro ao listar tamanhos:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao listar tamanhos.'
        });
    }
}

async function buscarTamanhoPorId(req, res) {
    try {
        const { id } = req.params;

        const tamanho = await tamanhoModel.buscarTamanhoPorId(id);

        if (!tamanho) {
            return res.status(404).json({
                success: false,
                message: 'Tamanho não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            data: tamanho
        });
    } catch (error) {
        console.error('Erro ao buscar tamanho:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar tamanho.'
        });
    }
}

async function criarTamanho(req, res) {
    try {
        const { nome, ordem } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome do tamanho é obrigatório.'
            });
        }

        const tamanho = await tamanhoModel.criarTamanho(
            nome.trim(),
            ordem
        );

        return res.status(201).json({
            success: true,
            message: 'Tamanho criado com sucesso.',
            data: tamanho
        });
    } catch (error) {
        console.error('Erro ao criar tamanho:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe um tamanho com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao criar tamanho.'
        });
    }
}

async function atualizarTamanho(req, res) {
    try {
        const { id } = req.params;
        const { nome, ordem, status } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome do tamanho é obrigatório.'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'O campo status deve ser booleano.'
            });
        }

        const tamanho = await tamanhoModel.atualizarTamanho(
            id,
            nome.trim(),
            ordem ?? 0,
            status
        );

        if (!tamanho) {
            return res.status(404).json({
                success: false,
                message: 'Tamanho não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tamanho atualizado com sucesso.',
            data: tamanho
        });
    } catch (error) {
        console.error('Erro ao atualizar tamanho:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Já existe um tamanho com este nome.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao atualizar tamanho.'
        });
    }
}

async function excluirTamanho(req, res) {
    try {
        const { id } = req.params;

        const excluido = await tamanhoModel.excluirTamanho(id);

        if (!excluido) {
            return res.status(404).json({
                success: false,
                message: 'Tamanho não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tamanho excluído com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao excluir tamanho:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir este tamanho porque existem variações de produtos vinculadas a ele.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao excluir tamanho.'
        });
    }
}

module.exports = {
    listarTamanhos,
    buscarTamanhoPorId,
    criarTamanho,
    atualizarTamanho,
    excluirTamanho
};