const db = require("../config/database");

async function listarFavoritos(req, res) {
    try {
        const cliente = await db.execute(
            `SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1`,
            [req.usuario.id_usuario]
        );
        const clienteId = cliente[0][0]?.id_cliente;

        if (!clienteId) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Cliente não encontrado."
            });
        }

        const [favoritos] = await db.execute(
            `
            SELECT
                f.id_favorito,
                f.id_produto,
                f.criado_em,
                p.nome,
                p.preco,
                p.estoque
            FROM favoritos f
            INNER JOIN produtos p
                ON p.id_produto = f.id_produto
            WHERE f.id_cliente = ?
            ORDER BY f.criado_em DESC
            `,
            [clienteId]
        );

        res.status(200).json({
            sucesso: true,
            favoritos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar favoritos."
        });
    }
}


async function adicionarFavorito(req, res) {
    try {
        const [clientes] = await db.execute(
            `SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1`,
            [req.usuario.id_usuario]
        );
        const clienteId = clientes[0]?.id_cliente;
        const { produto_id } = req.body;

        if (!clienteId) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Cliente não encontrado."
            });
        }

        if (!produto_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "produto_id é obrigatório."
            });
        }

        const [produto] = await db.execute(
            `
            SELECT id_produto
            FROM produtos
            WHERE id_produto = ?
            `,
            [produto_id]
        );

        if (produto.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        await db.execute(
            `
            INSERT INTO favoritos
            (id_cliente, id_produto)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                id_produto = id_produto
            `,
            [clienteId, produto_id]
        );

        res.status(201).json({
            sucesso: true,
            mensagem: "Produto adicionado aos favoritos."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao adicionar favorito."
        });
    }
}


async function removerFavorito(req, res) {
    try {
        const [clientes] = await db.execute(
            `SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1`,
            [req.usuario.id_usuario]
        );
        const clienteId = clientes[0]?.id_cliente;
        const produtoId = req.params.produtoId;

        if (!clienteId) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Cliente não encontrado."
            });
        }

        const [resultado] = await db.execute(
            `
            DELETE FROM favoritos
                        WHERE id_cliente = ?
                            AND id_produto = ?
            `,
            [clienteId, produtoId]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não está nos favoritos."
            });
        }

        res.status(200).json({
            sucesso: true,
            mensagem: "Produto removido dos favoritos."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao remover favorito."
        });
    }
}


async function verificarFavorito(req, res) {
    try {
        const [clientes] = await db.execute(
            `SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1`,
            [req.usuario.id_usuario]
        );
        const clienteId = clientes[0]?.id_cliente;
        const produtoId = req.params.produtoId;

        if (!clienteId) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Cliente não encontrado."
            });
        }

        const [resultado] = await db.execute(
            `
                        SELECT id_favorito
            FROM favoritos
                        WHERE id_cliente = ?
                            AND id_produto = ?
            `,
            [clienteId, produtoId]
        );

        res.status(200).json({
            sucesso: true,
            favorito: resultado.length > 0
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao verificar favorito."
        });
    }
}


module.exports = {
    listarFavoritos,
    adicionarFavorito,
    removerFavorito,
    verificarFavorito
};