const AvaliacaoModel = require('../models/avaliacaoModel');

class AvaliacaoController {

    // GET /api/avaliacoes
    static async listar(req, res) {
        try {
            const avaliacoes =
                await AvaliacaoModel.listarTodas();

            return res.status(200).json({
                success: true,
                message: 'Avaliações listadas com sucesso.',
                data: avaliacoes
            });

        } catch (error) {
            console.error('Erro ao listar avaliações:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar avaliações.'
            });
        }
    }

    // GET /api/avaliacoes/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da avaliação inválido.'
                });
            }

            const avaliacao =
                await AvaliacaoModel.buscarPorId(id);

            if (!avaliacao) {
                return res.status(404).json({
                    success: false,
                    message: 'Avaliação não encontrada.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Avaliação encontrada com sucesso.',
                data: avaliacao
            });

        } catch (error) {
            console.error('Erro ao buscar avaliação:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar avaliação.'
            });
        }
    }

    // GET /api/avaliacoes/produto/:id_produto
    static async listarPorProduto(req, res) {
        try {
            const { id_produto } = req.params;

            if (
                !Number.isInteger(Number(id_produto)) ||
                Number(id_produto) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do produto inválido.'
                });
            }

            const avaliacoes =
                await AvaliacaoModel.listarPorProduto(id_produto);

            return res.status(200).json({
                success: true,
                message: 'Avaliações do produto listadas com sucesso.',
                data: avaliacoes
            });

        } catch (error) {
            console.error(
                'Erro ao listar avaliações do produto:',
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    'Erro interno ao listar avaliações do produto.'
            });
        }
    }

    // POST /api/avaliacoes
    static async criar(req, res) {
        try {
            const dados = req.body;

            if (!dados.id_cliente) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_cliente é obrigatório.'
                });
            }

            if (!dados.id_produto) {
                return res.status(400).json({
                    success: false,
                    message: 'O id_produto é obrigatório.'
                });
            }

            if (
                dados.nota === undefined ||
                !Number.isInteger(Number(dados.nota)) ||
                Number(dados.nota) < 1 ||
                Number(dados.nota) > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'A nota deve ser um número entre 1 e 5.'
                });
            }

            const avaliacao =
                await AvaliacaoModel.criar(dados);

            return res.status(201).json({
                success: true,
                message: 'Avaliação criada com sucesso.',
                data: avaliacao
            });

        } catch (error) {
            console.error('Erro ao criar avaliação:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message:
                        'Este cliente já possui uma avaliação para este produto.'
                });
            }

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    success: false,
                    message:
                        'Cliente ou produto informado não existe.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao criar avaliação.'
            });
        }
    }

    // PUT /api/avaliacoes/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da avaliação inválido.'
                });
            }

            if (
                dados.nota !== undefined &&
                (
                    !Number.isInteger(Number(dados.nota)) ||
                    Number(dados.nota) < 1 ||
                    Number(dados.nota) > 5
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'A nota deve ser um número entre 1 e 5.'
                });
            }

            const avaliacao =
                await AvaliacaoModel.buscarPorId(id);

            if (!avaliacao) {
                return res.status(404).json({
                    success: false,
                    message: 'Avaliação não encontrada.'
                });
            }

            await AvaliacaoModel.atualizar(id, dados);

            const atualizada =
                await AvaliacaoModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Avaliação atualizada com sucesso.',
                data: atualizada
            });

        } catch (error) {
            console.error('Erro ao atualizar avaliação:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar avaliação.'
            });
        }
    }

    // DELETE /api/avaliacoes/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da avaliação inválido.'
                });
            }

            const avaliacao =
                await AvaliacaoModel.buscarPorId(id);

            if (!avaliacao) {
                return res.status(404).json({
                    success: false,
                    message: 'Avaliação não encontrada.'
                });
            }

            await AvaliacaoModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Avaliação excluída com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir avaliação:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir avaliação.'
            });
        }
    }
}

module.exports = AvaliacaoController;