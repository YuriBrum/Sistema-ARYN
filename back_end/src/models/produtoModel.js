const pool = require('../config/database');

async function listarProdutos() {
    const [rows] = await pool.query(`
        SELECT
            p.id_produto,
            p.id_categoria,
            c.nome AS categoria,
            p.nome,
            p.descricao,
            p.preco,
            p.imagem,
            p.status,
            p.criado_em,
            p.atualizado_em
        FROM produtos p
        INNER JOIN categorias c
            ON c.id_categoria = p.id_categoria
        ORDER BY p.criado_em DESC
    `);

    return rows;
}

async function buscarProdutoPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            p.id_produto,
            p.id_categoria,
            c.nome AS categoria,
            p.nome,
            p.descricao,
            p.preco,
            p.imagem,
            p.status,
            p.criado_em,
            p.atualizado_em
        FROM produtos p
        INNER JOIN categorias c
            ON c.id_categoria = p.id_categoria
        WHERE p.id_produto = ?
    `, [id]);

    return rows[0];
}

async function criarProduto(
    id_categoria,
    nome,
    descricao,
    preco,
    imagem
) {
    const [result] = await pool.query(`
        INSERT INTO produtos (
            id_categoria,
            nome,
            descricao,
            preco,
            imagem
        )
        VALUES (?, ?, ?, ?, ?)
    `, [
        id_categoria,
        nome,
        descricao || null,
        preco,
        imagem || null
    ]);

    return buscarProdutoPorId(result.insertId);
}

async function atualizarProduto(
    id,
    id_categoria,
    nome,
    descricao,
    preco,
    imagem,
    status
) {
    const [result] = await pool.query(`
        UPDATE produtos
        SET
            id_categoria = ?,
            nome = ?,
            descricao = ?,
            preco = ?,
            imagem = ?,
            status = ?
        WHERE id_produto = ?
    `, [
        id_categoria,
        nome,
        descricao || null,
        preco,
        imagem || null,
        status,
        id
    ]);

    if (result.affectedRows === 0) {
        return null;
    }

    return buscarProdutoPorId(id);
}

async function excluirProduto(id) {
    const [result] = await pool.query(`
        DELETE FROM produtos
        WHERE id_produto = ?
    `, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    excluirProduto
};