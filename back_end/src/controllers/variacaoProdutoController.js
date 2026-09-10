const variacaoProdutoModel =
    require('../models/variacaoProdutoModel');

async function listarVariacoes(req, res) {
    try {
        const variacoes =
            await variacaoProdutoModel.listarVariacoes();

        return res.status(200).json({
            success: true,
            data: variacoes
        });

    } catch (error) {
        console.error('Erro ao listar variações:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao listar variações.'
        });
    }
}

async function buscarVariacaoPorId(req, res) {
    try {
        const { id } = req.params;

        const variacao =
            await variacaoProdutoModel.buscarVariacaoPorId(id);

        if (!variacao) {
            return res.status(404).json({
                success: false,
                message: 'Variação não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            data: variacao
        });

    } catch (error) {
        console.error('Erro ao buscar variação:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar variação.'
        });
    }
}

async function criarVariacao(req, res) {
    try {
        const {
            id_produto,
            id_tamanho,
            id_cor,
            sku,
            estoque,
            preco
        } = req.body;

        if (!id_produto) {
            return res.status(400).json({
                success: false,
                message: 'O produto é obrigatório.'
            });
        }

        if (!id_tamanho) {
            return res.status(400).json({
                success: false,
                message: 'O tamanho é obrigatório.'
            });
        }

        if (!id_cor) {
            return res.status(400).json({
                success: false,
                message: 'A cor é obrigatória.'
            });
        }

        if (!sku || sku.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O SKU é obrigatório.'
            });
        }

        if (
            estoque !== undefined &&
            (
                Number.isNaN(Number(estoque)) ||
                Number(estoque) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'O estoque informado é inválido.'
            });
        }

        if (
            preco !== undefined &&
            preco !== null &&
            (
                Number.isNaN(Number(preco)) ||
                Number(preco) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'O preço informado é inválido.'
            });
        }

        const variacao =
            await variacaoProdutoModel.criarVariacao(
                id_produto,
                id_tamanho,
                id_cor,
                sku.trim(),
                estoque,
                preco
            );

        return res.status(201).json({
            success: true,
            message: 'Variação criada com sucesso.',
            data: variacao
        });

    } catch (error) {
        console.error('Erro ao criar variação:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message:
                    'Já existe uma variação com este SKU ou combinação de produto, tamanho e cor.'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message:
                    'Produto, tamanho ou cor informado não existe.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao criar variação.'
        });
    }
}

async function atualizarVariacao(req, res) {
    try {
        const { id } = req.params;

        const {
            id_produto,
            id_tamanho,
            id_cor,
            sku,
            preco,
            status
        } = req.body;

        if (!id_produto) {
            return res.status(400).json({
                success: false,
                message: 'O produto é obrigatório.'
            });
        }

        if (!id_tamanho) {
            return res.status(400).json({
                success: false,
                message: 'O tamanho é obrigatório.'
            });
        }

        if (!id_cor) {
            return res.status(400).json({
                success: false,
                message: 'A cor é obrigatória.'
            });
        }

        if (!sku || sku.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O SKU é obrigatório.'
            });
        }

        if (
            preco !== undefined &&
            preco !== null &&
            (
                Number.isNaN(Number(preco)) ||
                Number(preco) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'O preço informado é inválido.'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message:
                    'O campo status deve ser booleano.'
            });
        }

        const variacao =
            await variacaoProdutoModel.atualizarVariacao(
                id,
                id_produto,
                id_tamanho,
                id_cor,
                sku.trim(),
                preco,
                status
            );

        if (!variacao) {
            return res.status(404).json({
                success: false,
                message: 'Variação não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Variação atualizada com sucesso.',
            data: variacao
        });

    } catch (error) {
        console.error(
            'Erro ao atualizar variação:',
            error
        );

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message:
                    'Já existe uma variação com este SKU ou combinação de produto, tamanho e cor.'
            });
        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message:
                    'Produto, tamanho ou cor informado não existe.'
            });
        }

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao atualizar variação.'
        });
    }
}

async function excluirVariacao(req, res) {
    try {
        const { id } = req.params;

        const excluida =
            await variacaoProdutoModel.excluirVariacao(id);

        if (!excluida) {
            return res.status(404).json({
                success: false,
                message: 'Variação não encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Variação excluída com sucesso.'
        });

    } catch (error) {
        console.error(
            'Erro ao excluir variação:',
            error
        );

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message:
                    'Não é possível excluir esta variação porque existem movimentações de estoque vinculadas a ela.'
            });
        }

        return res.status(500).json({
            success: false,
            message:
                'Erro interno ao excluir variação.'
        });
    }
}

module.exports = {
    listarVariacoes,
    buscarVariacaoPorId,
    criarVariacao,
    atualizarVariacao,
    excluirVariacao
};