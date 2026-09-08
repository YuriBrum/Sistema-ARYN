const produtoModel = require('../models/produtoModel');

async function listarProdutos(req, res) {
    try {
        const produtos = await produtoModel.listarProdutos();

        return res.status(200).json({
            success: true,
            data: produtos
        });

    } catch (error) {
        console.error('Erro ao listar produtos:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao listar produtos.'
        });
    }
}

async function buscarProdutoPorId(req, res) {
    try {
        const { id } = req.params;

        const produto = await produtoModel.buscarProdutoPorId(id);

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            data: produto
        });

    } catch (error) {
        console.error('Erro ao buscar produto:', error);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao buscar produto.'
        });
    }
}

async function criarProduto(req, res) {
    try {
        const {
            id_categoria,
            nome,
            descricao,
            preco,
            imagem
        } = req.body;

        if (!id_categoria) {
            return res.status(400).json({
                success: false,
                message: 'A categoria do produto é obrigatória.'
            });
        }

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome do produto é obrigatório.'
            });
        }

        if (preco === undefined || preco === null || Number(preco) < 0) {
            return res.status(400).json({
                success: false,
                message: 'O preço do produto é inválido.'
            });
        }

        const produto = await produtoModel.criarProduto(
            id_categoria,
            nome.trim(),
            descricao,
            preco,
            imagem
        );

        return res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso.',
            data: produto
        });

    } catch (error) {
        console.error('Erro ao criar produto:', error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'A categoria informada não existe.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao criar produto.'
        });
    }
}

async function atualizarProduto(req, res) {
    try {
        const { id } = req.params;

        const {
            id_categoria,
            nome,
            descricao,
            preco,
            imagem,
            status
        } = req.body;

        if (!id_categoria) {
            return res.status(400).json({
                success: false,
                message: 'A categoria do produto é obrigatória.'
            });
        }

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'O nome do produto é obrigatório.'
            });
        }

        if (preco === undefined || preco === null || Number(preco) < 0) {
            return res.status(400).json({
                success: false,
                message: 'O preço do produto é inválido.'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'O campo status deve ser booleano.'
            });
        }

        const produto = await produtoModel.atualizarProduto(
            id,
            id_categoria,
            nome.trim(),
            descricao,
            preco,
            imagem,
            status
        );

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Produto atualizado com sucesso.',
            data: produto
        });

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: 'A categoria informada não existe.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao atualizar produto.'
        });
    }
}

async function excluirProduto(req, res) {
    try {
        const { id } = req.params;

        const excluido = await produtoModel.excluirProduto(id);

        if (!excluido) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Produto excluído com sucesso.'
        });

    } catch (error) {
        console.error('Erro ao excluir produto:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir este produto porque existem registros vinculados a ele.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao excluir produto.'
        });
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    excluirProduto
};