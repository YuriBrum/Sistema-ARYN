const carrinhoModel =
    require('../models/carrinhoModel');

const produtoModel =
    require('../models/produtoModel');

async function obterCliente(req) {

    const id_usuario =
        req.usuario.id_usuario;

    return await carrinhoModel.buscarClientePorUsuario(
        id_usuario
    );
}

async function obterCarrinho(req, res) {

    try {

        const cliente =
            await obterCliente(req);

        if (!cliente) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente não encontrado.'

            });

        }

        const carrinho =
            await carrinhoModel.buscarOuCriarCarrinho(
                cliente.id_cliente
            );

        const itens =
            await carrinhoModel.buscarItensCarrinho(
                carrinho.id_carrinho
            );

        const quantidadeItens =
            await carrinhoModel.contarItens(
                carrinho.id_carrinho
            );

        const subtotal =
            itens.reduce(
                (total, item) => {

                    return total +
                        Number(item.preco_unitario) *
                        Number(item.quantidade);

                },
                0
            );

        return res.status(200).json({

            success: true,

            data: {

                id_carrinho:
                    carrinho.id_carrinho,

                status:
                    carrinho.status,

                quantidade_itens:
                    quantidadeItens,

                subtotal:
                    Number(subtotal.toFixed(2)),

                itens

            }

        });

    } catch (error) {

        console.error(
            'Erro ao buscar carrinho:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Erro interno ao buscar carrinho.'

        });

    }

}

async function adicionarItem(req, res) {

    try {

        const {
            id_produto,
            quantidade
        } = req.body;

        if (!id_produto) {

            return res.status(400).json({

                success: false,

                message:
                    'O produto é obrigatório.'

            });

        }

        const quantidadeNumerica =
            Number(quantidade);

        if (
            !Number.isInteger(
                quantidadeNumerica
            ) ||
            quantidadeNumerica <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'A quantidade deve ser um número inteiro maior que zero.'

            });

        }

        const cliente =
            await obterCliente(req);

        if (!cliente) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente não encontrado.'

            });

        }

        const produto =
            await produtoModel.buscarPorId(
                id_produto
            );

        if (!produto) {

            return res.status(404).json({

                success: false,

                message:
                    'Produto não encontrado.'

            });

        }

        const carrinho =
            await carrinhoModel.buscarOuCriarCarrinho(
                cliente.id_cliente
            );

        const itemExistente =
            await carrinhoModel.buscarItemPorProduto(
                carrinho.id_carrinho,
                id_produto
            );

        if (itemExistente) {

            const novaQuantidade =
                Number(itemExistente.quantidade) +
                quantidadeNumerica;

            await carrinhoModel.atualizarItem(
                itemExistente.id_item,
                carrinho.id_carrinho,
                novaQuantidade
            );

        } else {

            await carrinhoModel.adicionarItem(
                carrinho.id_carrinho,
                id_produto,
                quantidadeNumerica,
                produto.preco
            );

        }

        const itens =
            await carrinhoModel.buscarItensCarrinho(
                carrinho.id_carrinho
            );

        return res.status(201).json({

            success: true,

            message:
                'Produto adicionado ao carrinho.',

            data: {

                id_carrinho:
                    carrinho.id_carrinho,

                itens

            }

        });

    } catch (error) {

        console.error(
            'Erro ao adicionar item ao carrinho:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Erro interno ao adicionar produto ao carrinho.'

        });

    }

}

async function atualizarItem(req, res) {

    try {

        const id_item =
            Number(req.params.id);

        const {
            quantidade
        } = req.body;

        if (
            !Number.isInteger(id_item) ||
            id_item <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'ID do item inválido.'

            });

        }

        const quantidadeNumerica =
            Number(quantidade);

        if (
            !Number.isInteger(
                quantidadeNumerica
            ) ||
            quantidadeNumerica <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'A quantidade deve ser um número inteiro maior que zero.'

            });

        }

        const cliente =
            await obterCliente(req);

        if (!cliente) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente não encontrado.'

            });

        }

        const carrinho =
            await carrinhoModel.buscarOuCriarCarrinho(
                cliente.id_cliente
            );

        const item =
            await carrinhoModel.buscarItemPorId(
                id_item,
                carrinho.id_carrinho
            );

        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    'Item não encontrado no carrinho.'

            });

        }

        await carrinhoModel.atualizarItem(
            id_item,
            carrinho.id_carrinho,
            quantidadeNumerica
        );

        return res.status(200).json({

            success: true,

            message:
                'Quantidade atualizada com sucesso.'

        });

    } catch (error) {

        console.error(
            'Erro ao atualizar item:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Erro interno ao atualizar item.'

        });

    }

}

async function removerItem(req, res) {

    try {

        const id_item =
            Number(req.params.id);

        if (
            !Number.isInteger(id_item) ||
            id_item <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'ID do item inválido.'

            });

        }

        const cliente =
            await obterCliente(req);

        if (!cliente) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente não encontrado.'

            });

        }

        const carrinho =
            await carrinhoModel.buscarOuCriarCarrinho(
                cliente.id_cliente
            );

        const removido =
            await carrinhoModel.removerItem(
                id_item,
                carrinho.id_carrinho
            );

        if (!removido) {

            return res.status(404).json({

                success: false,

                message:
                    'Item não encontrado no carrinho.'

            });

        }

        return res.status(200).json({

            success: true,

            message:
                'Item removido do carrinho.'

        });

    } catch (error) {

        console.error(
            'Erro ao remover item:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Erro interno ao remover item.'

        });

    }

}

async function limparCarrinho(req, res) {

    try {

        const cliente =
            await obterCliente(req);

        if (!cliente) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente não encontrado.'

            });

        }

        const carrinho =
            await carrinhoModel.buscarOuCriarCarrinho(
                cliente.id_cliente
            );

        await carrinhoModel.limparCarrinho(
            carrinho.id_carrinho
        );

        return res.status(200).json({

            success: true,

            message:
                'Carrinho limpo com sucesso.'

        });

    } catch (error) {

        console.error(
            'Erro ao limpar carrinho:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Erro interno ao limpar carrinho.'

        });

    }

}

module.exports = {

    obterCarrinho,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho

};