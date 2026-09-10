const db = require("../config/database");

async function listarFavoritos(req, res) {
    try {
        const clienteId = req.user.id;

        const [favoritos] = await db.execute(
            `
            SELECT
                f.id,
                f.produto_id,
                f.criado_em,
                p.nome,
                p.preco,
                p.estoque
            FROM favoritos f
            INNER JOIN produtos p
                ON p.id = f.produto_id
            WHERE f.cliente_id = ?
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
        const clienteId = req.user.id;
        const { produto_id } = req.body;

        if (!produto_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "produto_id é obrigatório."
            });
        }

        const [produto] = await db.execute(
            `
            SELECT id
            FROM produtos
            WHERE id = ?
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
            (cliente_id, produto_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                produto_id = produto_id
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
        const clienteId = req.user.id;
        const produtoId = req.params.produtoId;

        const [resultado] = await db.execute(
            `
            DELETE FROM favoritos
            WHERE cliente_id = ?
              AND produto_id = ?
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
        const clienteId = req.user.id;
        const produtoId = req.params.produtoId;

        const [resultado] = await db.execute(
            `
            SELECT id
            FROM favoritos
            WHERE cliente_id = ?
              AND produto_id = ?
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