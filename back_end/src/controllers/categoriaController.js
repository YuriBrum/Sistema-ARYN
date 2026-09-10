const CategoriaModel = require('../models/categoriaModel');

class CategoriaController {

    // GET /api/categorias
    static async listar(req, res) {
        try {
            const categorias = await CategoriaModel.listarTodas();

            return res.status(200).json({
                success: true,
                message: 'Categorias listadas com sucesso.',
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

    // GET /api/categorias/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da categoria inválido.'
                });
            }

            const categoria = await CategoriaModel.buscarPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Categoria encontrada com sucesso.',
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

    // POST /api/categorias
    static async criar(req, res) {
        try {
            const { nome } = req.body;

            if (!nome || typeof nome !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'O campo nome é obrigatório.'
                });
            }

            const nomeTratado = nome.trim();

            if (!nomeTratado) {
                return res.status(400).json({
                    success: false,
                    message: 'O nome não pode estar vazio.'
                });
            }

            if (nomeTratado.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'O nome deve possuir no máximo 100 caracteres.'
                });
            }

            const existente =
                await CategoriaModel.buscarPorNome(nomeTratado);

            if (existente) {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe uma categoria com esse nome.'
                });
            }

            const categoria =
                await CategoriaModel.criar(nomeTratado);

            return res.status(201).json({
                success: true,
                message: 'Categoria criada com sucesso.',
                data: categoria
            });

        } catch (error) {
            console.error('Erro ao criar categoria:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao criar categoria.'
            });
        }
    }

    // PUT /api/categorias/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da categoria inválido.'
                });
            }

            if (!nome || typeof nome !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'O campo nome é obrigatório.'
                });
            }

            const nomeTratado = nome.trim();

            const categoria =
                await CategoriaModel.buscarPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada.'
                });
            }

            const existente =
                await CategoriaModel.buscarPorNome(nomeTratado);

            if (
                existente &&
                Number(existente.id_categoria) !== Number(id)
            ) {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe outra categoria com esse nome.'
                });
            }

            await CategoriaModel.atualizar(id, nomeTratado);

            const atualizada =
                await CategoriaModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Categoria atualizada com sucesso.',
                data: atualizada
            });

        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar categoria.'
            });
        }
    }

    // DELETE /api/categorias/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID da categoria inválido.'
                });
            }

            const categoria =
                await CategoriaModel.buscarPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada.'
                });
            }

            await CategoriaModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Categoria excluída com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir categoria:', error);

            if (
                error.code === 'ER_ROW_IS_REFERENCED_2' ||
                error.code === 'ER_ROW_IS_REFERENCED'
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        'Não é possível excluir a categoria porque existem registros vinculados a ela.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir categoria.'
            });
        }
    }
}

module.exports = CategoriaController;