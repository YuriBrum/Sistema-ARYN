const { pool } = require('../config/database');

async function listarProdutos(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE p.status = 1
      ORDER BY p.id_produto DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar produtos.', details: error.message });
  }
}

async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE p.id_produto = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar produto.', details: error.message });
  }
}

async function criarProduto(req, res) {
  try {
    const { id_categoria, nome, descricao, preco, imagem, status = 1 } = req.body;

    if (!id_categoria || !nome || !preco) {
      return res.status(400).json({ success: false, message: 'Campo obrigatório ausente: id_categoria, nome ou preco.' });
    }

    const [result] = await pool.query(
      `INSERT INTO produtos (id_categoria, nome, descricao, preco, imagem, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_categoria, nome, descricao || null, preco, imagem || null, status]
    );

    res.status(201).json({ success: true, message: 'Produto criado com sucesso.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar produto.', details: error.message });
  }
}

async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { id_categoria, nome, descricao, preco, imagem, status } = req.body;

    const campos = [];
    const valores = [];

    if (id_categoria !== undefined) { campos.push('id_categoria = ?'); valores.push(id_categoria); }
    if (nome !== undefined) { campos.push('nome = ?'); valores.push(nome); }
    if (descricao !== undefined) { campos.push('descricao = ?'); valores.push(descricao); }
    if (preco !== undefined) { campos.push('preco = ?'); valores.push(preco); }
    if (imagem !== undefined) { campos.push('imagem = ?'); valores.push(imagem); }
    if (status !== undefined) { campos.push('status = ?'); valores.push(status); }

    if (!campos.length) {
      return res.status(400).json({ success: false, message: 'Nenhum campo informado para atualização.' });
    }

    valores.push(id);
    const [result] = await pool.query(`UPDATE produtos SET ${campos.join(', ')} WHERE id_produto = ?`, valores);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    res.json({ success: true, message: 'Produto atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto.', details: error.message });
  }
}

async function removerProduto(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    res.json({ success: true, message: 'Produto removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover produto.', details: error.message });
  }
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  removerProduto
};
