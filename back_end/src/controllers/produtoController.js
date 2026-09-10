const ProdutoModel = require('../models/produtoModel');

class ProdutoController {

    // GET /api/produtos
    static async listar(req, res) {
        try {
            const produtos = await ProdutoModel.listarTodos();

            return res.status(200).json({
                success: true,
                message: 'Produtos listados com sucesso.',
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

    // GET /api/produtos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do produto inválido.'
                });
            }

            const produto =
                await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Produto encontrado com sucesso.',
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

    // GET /api/produtos/categoria/:id_categoria
    static async listarPorCategoria(req, res) {
        try {
            const { id_categoria } = req.params;

            if (
                !Number.isInteger(Number(id_categoria)) ||
                Number(id_categoria) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da categoria inválido.'
                });
            }

            const produtos =
                await ProdutoModel.listarPorCategoria(id_categoria);

            return res.status(200).json({
                success: true,
                message: 'Produtos da categoria listados com sucesso.',
                data: produtos
            });

        } catch (error) {
            console.error(
                'Erro ao listar produtos por categoria:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    'Erro interno ao listar produtos por categoria.'
            });
        }
    }

    // POST /api/produtos
    static async criar(req, res) {
        try {
            const dados = req.body;

            if (!dados.nome || typeof dados.nome !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'O nome do produto é obrigatório.'
                });
            }

            if (
                dados.preco === undefined ||
                isNaN(Number(dados.preco)) ||
                Number(dados.preco) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'O preço do produto é inválido.'
                });
            }

            if (
                dados.quantidade === undefined ||
                !Number.isInteger(Number(dados.quantidade)) ||
                Number(dados.quantidade) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'A quantidade do produto é inválida.'
                });
            }

            if (
                !dados.id_categoria ||
                !Number.isInteger(Number(dados.id_categoria)) ||
                Number(dados.id_categoria) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_categoria é obrigatório.'
                });
            }

            const produto =
                await ProdutoModel.criar(dados);

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

    // PUT /api/produtos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do produto inválido.'
                });
            }

            const produto =
                await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            if (dados.nome !== undefined) {
                if (
                    typeof dados.nome !== 'string' ||
                    !dados.nome.trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Nome do produto inválido.'
                    });
                }
            }

            if (dados.preco !== undefined) {
                if (
                    isNaN(Number(dados.preco)) ||
                    Number(dados.preco) < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Preço do produto inválido.'
                    });
                }
            }

            if (dados.quantidade !== undefined) {
                if (
                    !Number.isInteger(Number(dados.quantidade)) ||
                    Number(dados.quantidade) < 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Quantidade do produto inválida.'
                    });
                }
            }

            await ProdutoModel.atualizar(id, dados);

            const atualizado =
                await ProdutoModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Produto atualizado com sucesso.',
                data: atualizado
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

    // DELETE /api/produtos/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do produto inválido.'
                });
            }

            const produto =
                await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            await ProdutoModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Produto excluído com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir produto:', error);

            if (
                error.code === 'ER_ROW_IS_REFERENCED_2' ||
                error.code === 'ER_ROW_IS_REFERENCED'
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        'Não é possível excluir o produto porque existem registros vinculados a ele.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir produto.'
            });
        }
    }
}

module.exports = ProdutoController;