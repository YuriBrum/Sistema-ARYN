const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

function tokenizar(usuario) {
  return jwt.sign(
    { id_usuario: usuario.id_usuario, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function cadastro(req, res) {
  const { nome, email, senha, telefone = null, cpf = null, data_nascimento = null, termos } = req.body || {};
  const nomeNormalizado = typeof nome === 'string' ? nome.trim().replace(/\s+/g, ' ') : '';
  const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const senhaValida = typeof senha === 'string' && senha.length >= 6;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);

  if (!nomeNormalizado || nomeNormalizado.length < 2 || !emailValido || !senhaValida || termos !== true) {
    return res.status(400).json({ success: false, message: 'Informe nome, e-mail válido, senha de pelo menos 6 caracteres e aceite os termos.' });
  }

  try {
    const [existente] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [emailNormalizado]);
    if (existente.length) return res.status(409).json({ success: false, message: 'Já existe um usuário cadastrado com este e-mail.' });

    const senhaHash = await bcrypt.hash(senha, 12);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [usuario] = await connection.query(
        'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [nomeNormalizado, emailNormalizado, senhaHash, 'CLIENTE']
      );
      const [cliente] = await connection.query(
        'INSERT INTO clientes (id_usuario, telefone, cpf, data_nascimento) VALUES (?, ?, ?, ?)',
        [usuario.insertId, telefone || null, cpf || null, data_nascimento || null]
      );
      await connection.commit();
      const dados = { id_usuario: usuario.insertId, id_cliente: cliente.insertId, nome: nomeNormalizado, email: emailNormalizado, tipo: 'CLIENTE' };
      return res.status(201).json({ success: true, message: 'Cliente cadastrado com sucesso.', data: { token: tokenizar(dados), usuario: dados } });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Este e-mail ou CPF já está cadastrado.' });
    }
    console.error('Erro ao cadastrar cliente:', error.message);
    return res.status(500).json({ success: false, message: 'Não foi possível concluir o cadastro.' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });

  try {
    const [rows] = await pool.query(`
      SELECT u.id_usuario, u.nome, u.email, u.senha, u.tipo, u.status, c.id_cliente
      FROM usuarios u LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
      WHERE u.email = ? LIMIT 1
    `, [email.trim().toLowerCase()]);
    const usuario = rows[0];
    if (!usuario || !usuario.status || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
    }

    delete usuario.senha;
    return res.json({ success: true, message: 'Login realizado com sucesso.', data: { token: tokenizar(usuario), usuario } });
  } catch (error) {
    console.error('Erro ao realizar login:', error.message);
    return res.status(500).json({ success: false, message: 'Não foi possível realizar o login.' });
  }
}

async function perfil(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id_usuario);
    if (!usuarioId) {
      return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    const [rows] = await pool.query(`
      SELECT u.id_usuario, u.nome, u.email, u.tipo, u.status, c.id_cliente
      FROM usuarios u
      LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
      WHERE u.id_usuario = ? LIMIT 1
    `, [usuarioId]);

    const usuario = rows[0];
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    return res.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error.message);
    return res.status(500).json({ success: false, message: 'Não foi possível carregar o perfil.' });
  }
}

module.exports = { cadastro, login, perfil };
