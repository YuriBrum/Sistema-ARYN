const pool = require('../config/database');

async function buscarEstoquePorVariacao(id_variacao) {
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
            v.status
        FROM variacoes_produto v
        INNER JOIN produtos p
            ON p.id_produto = v.id_produto
        INNER JOIN tamanhos t
            ON t.id_tamanho = v.id_tamanho
        INNER JOIN cores c
            ON c.id_cor = v.id_cor
        WHERE v.id_variacao = ?
    `, [id_variacao]);

    return rows[0];
}

async function listarMovimentacoes(id_variacao = null) {
    let sql = `
        SELECT
            m.id_movimentacao,
            m.id_variacao,
            p.nome AS produto,
            t.nome AS tamanho,
            c.nome AS cor,
            v.sku,
            m.tipo,
            m.quantidade,
            m.estoque_anterior,
            m.estoque_posterior,
            m.motivo,
            m.id_pedido,
            m.id_usuario,
            m.criado_em
        FROM movimentacoes_estoque m
        INNER JOIN variacoes_produto v
            ON v.id_variacao = m.id_variacao
        INNER JOIN produtos p
            ON p.id_produto = v.id_produto
        INNER JOIN tamanhos t
            ON t.id_tamanho = v.id_tamanho
        INNER JOIN cores c
            ON c.id_cor = v.id_cor
    `;

    const params = [];

    if (id_variacao) {
        sql += `
            WHERE m.id_variacao = ?
        `;

        params.push(id_variacao);
    }

    sql += `
        ORDER BY m.criado_em DESC
    `;

    const [rows] = await pool.query(sql, params);

    return rows;
}

async function movimentarEstoque({
    id_variacao,
    tipo,
    quantidade,
    motivo,
    id_pedido,
    id_usuario
}) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [variacoes] = await connection.query(`
            SELECT
                id_variacao,
                estoque,
                status
            FROM variacoes_produto
            WHERE id_variacao = ?
            FOR UPDATE
        `, [id_variacao]);

        if (variacoes.length === 0) {
            throw new Error('VARIACAO_NAO_ENCONTRADA');
        }

        const variacao = variacoes[0];

        if (!variacao.status) {
            throw new Error('VARIACAO_INATIVA');
        }

        const estoqueAnterior =
            Number(variacao.estoque);

        const quantidadeMovimentada =
            Number(quantidade);

        let estoquePosterior;

        if (
            tipo === 'ENTRADA' ||
            tipo === 'DEVOLUCAO'
        ) {
            estoquePosterior =
                estoqueAnterior +
                quantidadeMovimentada;
        }

        if (tipo === 'SAIDA') {
            estoquePosterior =
                estoqueAnterior -
                quantidadeMovimentada;

            if (estoquePosterior < 0) {
                throw new Error(
                    'ESTOQUE_INSUFICIENTE'
                );
            }
        }

        if (tipo === 'AJUSTE') {
            estoquePosterior =
                quantidadeMovimentada;
        }

        await connection.query(`
            UPDATE variacoes_produto
            SET estoque = ?
            WHERE id_variacao = ?
        `, [
            estoquePosterior,
            id_variacao
        ]);

        const [result] = await connection.query(`
            INSERT INTO movimentacoes_estoque (
                id_variacao,
                tipo,
                quantidade,
                estoque_anterior,
                estoque_posterior,
                motivo,
                id_pedido,
                id_usuario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_variacao,
            tipo,
            quantidadeMovimentada,
            estoqueAnterior,
            estoquePosterior,
            motivo || null,
            id_pedido || null,
            id_usuario || null
        ]);

        await connection.commit();

        return {
            id_movimentacao: result.insertId,
            id_variacao,
            tipo,
            quantidade: quantidadeMovimentada,
            estoque_anterior: estoqueAnterior,
            estoque_posterior: estoquePosterior,
            motivo: motivo || null,
            id_pedido: id_pedido || null,
            id_usuario: id_usuario || null
        };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}

module.exports = {
    buscarEstoquePorVariacao,
    listarMovimentacoes,
    movimentarEstoque
};