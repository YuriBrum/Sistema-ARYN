const pool = require('../config/database');

async function listarCores() {
    const [rows] = await pool.query(`
        SELECT
            id_cor,
            nome,
            codigo_hex,
            status,
            criado_em
        FROM cores
        ORDER BY nome ASC
    `);

    return rows;
}

async function buscarCorPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            id_cor,
            nome,
            codigo_hex,
            status,
            criado_em
        FROM cores
        WHERE id_cor = ?
    `, [id]);

    return rows[0];
}

async function criarCor(nome, codigo_hex) {
    const [result] = await pool.query(`
        INSERT INTO cores (nome, codigo_hex)
        VALUES (?, ?)
    `, [nome, codigo_hex || null]);

    return buscarCorPorId(result.insertId);
}

async function atualizarCor(id, nome, codigo_hex, status) {
    const [result] = await pool.query(`
        UPDATE cores
        SET
            nome = ?,
            codigo_hex = ?,
            status = ?
        WHERE id_cor = ?
    `, [nome, codigo_hex || null, status, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return buscarCorPorId(id);
}

async function excluirCor(id) {
    const [result] = await pool.query(`
        DELETE FROM cores
        WHERE id_cor = ?
    `, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    listarCores,
    buscarCorPorId,
    criarCor,
    atualizarCor,
    excluirCor
};