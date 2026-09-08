const pool = require('../config/database');

async function listarTamanhos() {
    const [rows] = await pool.query(`
        SELECT
            id_tamanho,
            nome,
            ordem,
            status,
            criado_em
        FROM tamanhos
        ORDER BY ordem ASC, nome ASC
    `);

    return rows;
}

async function buscarTamanhoPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            id_tamanho,
            nome,
            ordem,
            status,
            criado_em
        FROM tamanhos
        WHERE id_tamanho = ?
    `, [id]);

    return rows[0];
}

async function criarTamanho(nome, ordem) {
    const [result] = await pool.query(`
        INSERT INTO tamanhos (nome, ordem)
        VALUES (?, ?)
    `, [nome, ordem ?? 0]);

    return buscarTamanhoPorId(result.insertId);
}

async function atualizarTamanho(id, nome, ordem, status) {
    const [result] = await pool.query(`
        UPDATE tamanhos
        SET
            nome = ?,
            ordem = ?,
            status = ?
        WHERE id_tamanho = ?
    `, [nome, ordem, status, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return buscarTamanhoPorId(id);
}

async function excluirTamanho(id) {
    const [result] = await pool.query(`
        DELETE FROM tamanhos
        WHERE id_tamanho = ?
    `, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    listarTamanhos,
    buscarTamanhoPorId,
    criarTamanho,
    atualizarTamanho,
    excluirTamanho
};