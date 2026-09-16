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
  const { nome, email, senha } = req.body || {};
  if (!nome || !email || !senha || senha.length < 6) {
    return res.status(400).json({ success: false, message: 'Nome, e-mail e senha de pelo menos 6 caracteres são obrigatórios.' });
  }

  try {
    const emailNormalizado = email.trim().toLowerCase();
    const [existente] = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [emailNormalizado]);
    if (existente.length) return res.status(409).json({ success: false, message: 'Já existe um usuário cadastrado com este e-mail.' });

    const senhaHash = await bcrypt.hash(senha, 12);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [usuario] = await connection.query(
        'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [nome.trim(), emailNormalizado, senhaHash, 'CLIENTE']
      );
      const [cliente] = await connection.query('INSERT INTO clientes (id_usuario) VALUES (?)', [usuario.insertId]);
      await connection.commit();
      const dados = { id_usuario: usuario.insertId, id_cliente: cliente.insertId, nome: nome.trim(), email: emailNormalizado, tipo: 'CLIENTE' };
      return res.status(201).json({ success: true, message: 'Cliente cadastrado com sucesso.', data: { token: tokenizar(dados), usuario: dados } });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
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

module.exports = { cadastro, login };
