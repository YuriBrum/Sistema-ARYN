const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

async function listarUsuarios(req, res) {
  try {
    const [rows] = await pool.query('SELECT id_usuario, nome, email, tipo, status, criado_em FROM usuarios ORDER BY id_usuario DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar usuários.', details: error.message });
  }
}

async function buscarUsuarioPorId(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id_usuario, nome, email, tipo, status, criado_em FROM usuarios WHERE id_usuario = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar usuário.', details: error.message });
  }
}

async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha, tipo = 'CLIENTE' } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios.' });
    }

    const [existing] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ success: false, message: 'Já existe um usuário cadastrado com este e-mail.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo]
    );

    let id_cliente = null;
    if (tipo === 'CLIENTE') {
      const [cliente] = await pool.query(
        'INSERT INTO clientes (id_usuario) VALUES (?)',
        [result.insertId]
      );
      id_cliente = cliente.insertId;
    }

    res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso.', id: result.insertId, id_cliente });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.', details: error.message });
  }
}

async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    const [rows] = await pool.query(
      `SELECT
        u.id_usuario,
        u.nome,
        u.email,
        u.senha,
        u.tipo,
        u.status,
        c.id_cliente
       FROM usuarios u
       LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
       WHERE u.email = ?`,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida || !usuario.status) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    delete usuario.senha;
    res.json({ success: true, message: 'Login realizado com sucesso.', usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao realizar login.', details: error.message });
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  cadastrarUsuario,
  loginUsuario
};
