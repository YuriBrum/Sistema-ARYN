const pool = require('../config/database');

async function listarCategorias() {
    const [rows] = await pool.query(`
        SELECT
            id_categoria,
            nome,
            descricao,
            status,
            criado_em
        FROM categorias
        ORDER BY nome ASC
    `);

    return rows;
}

async function buscarCategoriaPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            id_categoria,
            nome,
            descricao,
            status,
            criado_em
        FROM categorias
        WHERE id_categoria = ?
    `, [id]);

    return rows[0];
}

async function criarCategoria(nome, descricao) {
    const [result] = await pool.query(`
        INSERT INTO categorias (nome, descricao)
        VALUES (?, ?)
    `, [nome, descricao || null]);

    return buscarCategoriaPorId(result.insertId);
}

async function atualizarCategoria(id, nome, descricao, status) {
    const [result] = await pool.query(`
        UPDATE categorias
        SET
            nome = ?,
            descricao = ?,
            status = ?
        WHERE id_categoria = ?
    `, [nome, descricao || null, status, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return buscarCategoriaPorId(id);
}

async function excluirCategoria(id) {
    const [result] = await pool.query(`
        DELETE FROM categorias
        WHERE id_categoria = ?
    `, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    listarCategorias,
    buscarCategoriaPorId,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria
};