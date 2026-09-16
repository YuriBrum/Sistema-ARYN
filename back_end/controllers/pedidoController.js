const { pool } = require('../config/database');

async function listarPedidos(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS nome_cliente
      FROM pedidos p
      LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
      ORDER BY p.id_pedido DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar pedidos.', details: error.message });
  }
}

async function buscarPedidoPorId(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS nome_cliente
      FROM pedidos p
      LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
      WHERE p.id_pedido = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar pedido.', details: error.message });
  }
}

async function criarPedido(req, res) {
  try {
    const { id_cliente, id_endereco, subtotal, frete = 0, desconto = 0, total } = req.body;

    if (!id_cliente || !id_endereco || !subtotal || !total) {
      return res.status(400).json({ success: false, message: 'Dados do pedido incompletos.' });
    }

    const [result] = await pool.query(
      `INSERT INTO pedidos (id_cliente, id_endereco, subtotal, frete, desconto, total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_endereco, subtotal, frete, desconto, total]
    );

    res.status(201).json({ success: true, message: 'Pedido criado com sucesso.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar pedido.', details: error.message });
  }
}

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido
};
