const { pool } = require('../config/database');

async function listarProdutos(req, res) {
  try {
    const { categoria, busca, precoMin, precoMax, estoque, ordenar = 'recentes', limite = 24, pagina = 1, novidades } = req.query;
    const filtros = ['p.status = 1'];
    const valores = [];

    if (novidades === '1') filtros.push('p.criado_em >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 90 DAY)');

    if (categoria) {
      filtros.push('p.id_categoria = ?');
      valores.push(Number(categoria));
    }
    if (busca) {
      filtros.push('(p.nome LIKE ? OR p.descricao LIKE ? OR c.nome LIKE ?)');
      const termo = `%${busca}%`;
      valores.push(termo, termo, termo);
    }
    if (precoMin !== undefined && precoMin !== '') {
      filtros.push('p.preco >= ?');
      valores.push(Number(precoMin));
    }
    if (precoMax !== undefined && precoMax !== '') {
      filtros.push('p.preco <= ?');
      valores.push(Number(precoMax));
    }
    if (estoque === '1') filtros.push('p.estoque > 0');

    const ordenacoes = {
      recentes: 'p.criado_em DESC',
      'menor-preco': 'p.preco ASC',
      'maior-preco': 'p.preco DESC',
      nome: 'p.nome ASC'
    };
    const limiteSeguro = Math.min(Math.max(Number(limite) || 24, 1), 100);
    const offset = Math.max((Number(pagina) - 1) * limiteSeguro, 0);
    valores.push(limiteSeguro, offset);

    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE ${filtros.join(' AND ')}
      ORDER BY ${ordenacoes[ordenar] || ordenacoes.recentes}
      LIMIT ? OFFSET ?
    `, valores);

    res.json({ success: true, data: rows, meta: { pagina: Number(pagina) || 1, limite: limiteSeguro } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar produtos.', details: error.message });
  }
}

async function listarNovidades(req, res) {
  req.query.novidades = '1';
  return listarProdutos(req, res);
}

async function listarOfertas(req, res) {
  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM produtos WHERE Field = 'preco_promocional'");

    if (!columns.length) {
      return res.json({
        success: true,
        message: 'Nenhuma oferta ativa encontrada.',
        data: [],
        meta: { pagina: 1, limite: 0, total: 0 }
      });
    }

    const { categoria, busca, precoMin, precoMax, estoque, descontoMin, ordenar = 'maior-desconto', limite = 24, pagina = 1 } = req.query;
    const filtros = ['p.status = 1', 'p.preco_promocional IS NOT NULL', 'p.preco_promocional < p.preco'];
    const valores = [];

    if (categoria) { filtros.push('p.id_categoria = ?'); valores.push(Number(categoria)); }
    if (busca) {
      filtros.push('(p.nome LIKE ? OR p.descricao LIKE ? OR c.nome LIKE ?)');
      const termo = `%${busca}%`;
      valores.push(termo, termo, termo);
    }
    if (precoMin !== undefined && precoMin !== '') { filtros.push('p.preco_promocional >= ?'); valores.push(Number(precoMin)); }
    if (precoMax !== undefined && precoMax !== '') { filtros.push('p.preco_promocional <= ?'); valores.push(Number(precoMax)); }
    if (estoque === '1') filtros.push('p.estoque > 0');
    if (descontoMin !== undefined && descontoMin !== '') filtros.push('((p.preco - p.preco_promocional) / p.preco) * 100 >= ' + Number(descontoMin));

    const ordenacoes = {
      relevantes: 'desconto_percentual DESC, p.criado_em DESC',
      'maior-desconto': 'desconto_percentual DESC',
      'menor-preco': 'p.preco_promocional ASC',
      'maior-preco': 'p.preco_promocional DESC',
      recentes: 'p.criado_em DESC'
    };
    const limiteSeguro = Math.min(Math.max(Number(limite) || 24, 1), 100);
    const paginaSegura = Math.max(Number(pagina) || 1, 1);
    const offset = (paginaSegura - 1) * limiteSeguro;
    valores.push(limiteSeguro, offset);

    const [rows] = await pool.query(`
      SELECT p.*, c.nome AS categoria_nome,
        p.preco AS preco_original,
        p.preco_promocional,
        ROUND(((p.preco - p.preco_promocional) / p.preco) * 100, 0) AS desconto_percentual
      FROM produtos p
      LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE ${filtros.join(' AND ')}
      ORDER BY ${ordenacoes[ordenar] || ordenacoes['maior-desconto']}
      LIMIT ? OFFSET ?
    `, valores);

    res.json({ success: true, message: 'Ofertas carregadas com sucesso.', data: rows, meta: { pagina: paginaSegura, limite: limiteSeguro } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Não foi possível carregar as ofertas.' });
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
  listarNovidades,
  listarOfertas,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  removerProduto
};
