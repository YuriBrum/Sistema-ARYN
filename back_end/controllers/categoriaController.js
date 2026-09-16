const { pool } = require('../config/database');

async function listarCategorias(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(p.id_produto) AS quantidade_produtos
      FROM categorias c
      LEFT JOIN produtos p ON p.id_categoria = c.id_categoria AND p.status = 1
      GROUP BY c.id_categoria
      ORDER BY c.id_categoria ASC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar categorias.', details: error.message });
  }
}

async function buscarCategoriaPorId(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar categoria.', details: error.message });
  }
}

async function cadastrarCategoria(req, res) {
  try {
    const { nome, descricao, status = 1 } = req.body;
    if (!nome) {
      return res.status(400).json({ success: false, message: 'Nome da categoria é obrigatório.' });
    }

    const [result] = await pool.query(
      'INSERT INTO categorias (nome, descricao, status) VALUES (?, ?, ?)',
      [nome, descricao || null, status]
    );

    res.status(201).json({ success: true, message: 'Categoria criada com sucesso.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar categoria.', details: error.message });
  }
}

module.exports = {
  listarCategorias,
  buscarCategoriaPorId,
  cadastrarCategoria
};
