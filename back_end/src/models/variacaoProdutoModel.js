const pool = require('../config/database');

async function listarVariacoes() {
    const [rows] = await pool.query(`
        SELECT
            v.id_variacao,
            v.id_produto,
            p.nome AS produto,
            v.id_tamanho,
            t.nome AS tamanho,
            v.id_cor,
            c.nome AS cor,
            c.codigo_hex,
            v.sku,
            v.estoque,
            v.preco,
            p.preco AS preco_produto,
            v.status,
            v.criado_em,
            v.atualizado_em
        FROM variacoes_produto v
        INNER JOIN produtos p
            ON p.id_produto = v.id_produto
        INNER JOIN tamanhos t
            ON t.id_tamanho = v.id_tamanho
        INNER JOIN cores c
            ON c.id_cor = v.id_cor
        ORDER BY
            p.nome ASC,
            t.ordem ASC,
            c.nome ASC
    `);

    return rows;
}

async function buscarVariacaoPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            v.id_variacao,
            v.id_produto,
            p.nome AS produto,
            v.id_tamanho,
            t.nome AS tamanho,
            v.id_cor,
            c.nome AS cor,
            c.codigo_hex,
            v.sku,
            v.estoque,
            v.preco,
            p.preco AS preco_produto,
            v.status,
            v.criado_em,
            v.atualizado_em
        FROM variacoes_produto v
        INNER JOIN produtos p
            ON p.id_produto = v.id_produto
        INNER JOIN tamanhos t
            ON t.id_tamanho = v.id_tamanho
        INNER JOIN cores c
            ON c.id_cor = v.id_cor
        WHERE v.id_variacao = ?
    `, [id]);

    return rows[0];
}

async function criarVariacao(
    id_produto,
    id_tamanho,
    id_cor,
    sku,
    estoque,
    preco
) {
    const [result] = await pool.query(`
        INSERT INTO variacoes_produto (
            id_produto,
            id_tamanho,
            id_cor,
            sku,
            estoque,
            preco
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        id_produto,
        id_tamanho,
        id_cor,
        sku,
        estoque ?? 0,
        preco ?? null
    ]);

    return buscarVariacaoPorId(result.insertId);
}

async function atualizarVariacao(
    id,
    id_produto,
    id_tamanho,
    id_cor,
    sku,
    preco,
    status
) {
    const [result] = await pool.query(`
        UPDATE variacoes_produto
        SET
            id_produto = ?,
            id_tamanho = ?,
            id_cor = ?,
            sku = ?,
            preco = ?,
            status = ?
        WHERE id_variacao = ?
    `, [
        id_produto,
        id_tamanho,
        id_cor,
        sku,
        preco ?? null,
        status,
        id
    ]);

    if (result.affectedRows === 0) {
        return null;
    }

    return buscarVariacaoPorId(id);
}

async function excluirVariacao(id) {
    const [result] = await pool.query(`
        DELETE FROM variacoes_produto
        WHERE id_variacao = ?
    `, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    listarVariacoes,
    buscarVariacaoPorId,
    criarVariacao,
    atualizarVariacao,
    excluirVariacao
};