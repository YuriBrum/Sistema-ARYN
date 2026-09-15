const pool = require('../config/database');

const Produto = {

    async listarTodos() {
        const [produtos] = await pool.query(`
            SELECT
                p.id_produto,
                p.nome,
                p.descricao,
                p.preco,
                p.imagem,
                p.id_categoria,
                c.nome AS categoria,
                p.status,
                p.criado_em,
                p.atualizado_em
            FROM produtos AS p
            INNER JOIN categorias AS c
                ON c.id_categoria = p.id_categoria
            ORDER BY p.id_produto DESC
        `);

        return produtos;
    },

    async buscarPorId(id) {
        const [produtos] = await pool.query(`
            SELECT
                p.id_produto,
                p.nome,
                p.descricao,
                p.preco,
                p.imagem,
                p.id_categoria,
                c.nome AS categoria,
                p.status,
                p.criado_em,
                p.atualizado_em
            FROM produtos AS p
            INNER JOIN categorias AS c
                ON c.id_categoria = p.id_categoria
            WHERE p.id_produto = ?
        `, [id]);

        return produtos[0];
    },

    async listarPorCategoria(idCategoria) {
        const [produtos] = await pool.query(`
            SELECT
                p.id_produto,
                p.nome,
                p.descricao,
                p.preco,
                p.imagem,
                p.id_categoria,
                c.nome AS categoria,
                p.status
            FROM produtos AS p
            INNER JOIN categorias AS c
                ON c.id_categoria = p.id_categoria
            WHERE p.id_categoria = ?
              AND p.status = 1
            ORDER BY p.nome ASC
        `, [idCategoria]);

        return produtos;
    }

};

module.exports = Produto;