const db = require('../config/database');

const ProdutoModel = {

    async listarTodos() {
        const [rows] = await db.execute(`
            SELECT
                p.*
            FROM produtos p
            ORDER BY p.id_produto DESC
        `);

        return rows;
    },

    async buscarPorId(id) {
        const [rows] = await db.execute(`
            SELECT
                p.*
            FROM produtos p
            WHERE p.id_produto = ?
        `, [id]);

        return rows[0] || null;
    },

    async listarPorCategoria(idCategoria) {
        const [rows] = await db.execute(`
            SELECT
                p.*
            FROM produtos p
            WHERE p.id_categoria = ?
            ORDER BY p.id_produto DESC
        `, [idCategoria]);

        return rows;
    },

    async criar(dados) {
        const {
            nome,
            descricao,
            preco,
            quantidade,
            tamanho,
            cor,
            imagem,
            id_categoria
        } = dados;

        const [result] = await db.execute(`
            INSERT INTO produtos (
                nome,
                descricao,
                preco,
                quantidade,
                tamanho,
                cor,
                imagem,
                id_categoria
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            nome,
            descricao,
            preco,
            quantidade,
            tamanho,
            cor,
            imagem,
            id_categoria
        ]);

        return this.buscarPorId(result.insertId);
    },

    async atualizar(id, dados) {
        const {
            nome,
            descricao,
            preco,
            quantidade,
            tamanho,
            cor,
            imagem,
            id_categoria
        } = dados;

        await db.execute(`
            UPDATE produtos
            SET
                nome = ?,
                descricao = ?,
                preco = ?,
                quantidade = ?,
                tamanho = ?,
                cor = ?,
                imagem = ?,
                id_categoria = ?
            WHERE id_produto = ?
        `, [
            nome,
            descricao,
            preco,
            quantidade,
            tamanho,
            cor,
            imagem,
            id_categoria,
            id
        ]);

        return this.buscarPorId(id);
    },

    async excluir(id) {
        const [result] = await db.execute(`
            DELETE FROM produtos
            WHERE id_produto = ?
        `, [id]);

        return result.affectedRows > 0;
    }
};

module.exports = ProdutoModel;