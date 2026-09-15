const ClienteModel = require('../models/clienteModel');

class ClienteController {

    // GET /api/clientes
    static async listar(req, res) {
        try {
            const clientes = await ClienteModel.listarTodos();

            return res.status(200).json({
                success: true,
                message: 'Clientes listados com sucesso.',
                data: clientes
            });

        } catch (error) {
            console.error('Erro ao listar clientes:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao listar clientes.'
            });
        }
    }

    // GET /api/clientes/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do cliente inválido.'
                });
            }

            const cliente =
                await ClienteModel.buscarPorId(id);

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente não encontrado.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cliente encontrado com sucesso.',
                data: cliente
            });

        } catch (error) {
            console.error('Erro ao buscar cliente:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao buscar cliente.'
            });
        }
    }

    // POST /api/clientes
    static async criar(req, res) {
        try {
            const dados = req.body;

            if (!dados.nome || typeof dados.nome !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'O nome do cliente é obrigatório.'
                });
            }

            if (!dados.email || typeof dados.email !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'O e-mail é obrigatório.'
                });
            }

            const email = dados.email.trim().toLowerCase();

            const emailExiste =
                await ClienteModel.buscarPorEmail(email);

            if (emailExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'Este e-mail já está cadastrado.'
                });
            }

            const cliente =
                await ClienteModel.criar({
                    ...dados,
                    email
                });

            return res.status(201).json({
                success: true,
                message: 'Cliente cadastrado com sucesso.',
                data: cliente
            });

        } catch (error) {
            console.error('Erro ao criar cliente:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe um cliente com esses dados.'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao cadastrar cliente.'
            });
        }
    }

    // PUT /api/clientes/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do cliente inválido.'
                });
            }

            const cliente =
                await ClienteModel.buscarPorId(id);

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente não encontrado.'
                });
            }

            if (dados.email) {
                dados.email = dados.email.trim().toLowerCase();

                const emailExiste =
                    await ClienteModel.buscarPorEmail(dados.email);

                if (
                    emailExiste &&
                    Number(emailExiste.id_cliente) !== Number(id)
                ) {
                    return res.status(409).json({
                        success: false,
                        message: 'Este e-mail já está cadastrado.'
                    });
                }
            }

            await ClienteModel.atualizar(id, dados);

            const atualizado =
                await ClienteModel.buscarPorId(id);

            return res.status(200).json({
                success: true,
                message: 'Cliente atualizado com sucesso.',
                data: atualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao atualizar cliente.'
            });
        }
    }

    // DELETE /api/clientes/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'ID do cliente inválido.'
                });
            }

            const cliente =
                await ClienteModel.buscarPorId(id);

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente não encontrado.'
                });
            }

            await ClienteModel.excluir(id);

            return res.status(200).json({
                success: true,
                message: 'Cliente excluído com sucesso.'
            });

        } catch (error) {
            console.error('Erro ao excluir cliente:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro interno ao excluir cliente.'
            });
        }
    }
}

module.exports = ClienteController;