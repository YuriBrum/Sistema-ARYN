const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const modernCartRoutes = require('./src/routes/carrinhoRoutes');
const colecaoRoutes = require('./routes/colecaoRoutes');
const { pool, pingDatabase } = require('./config/database');
const { autenticar } = require('./src/middlewares/authMiddleware');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..'), { index: false }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/carrinho', modernCartRoutes);
app.use('/api/favoritos', require('./src/routes/favoritoRoutes'));
app.use('/api/colecoes', colecaoRoutes);
app.get('/api/pedidos/me', autenticar, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*
      FROM pedidos p
      INNER JOIN clientes c ON c.id_cliente = p.id_cliente
      WHERE c.id_usuario = ?
      ORDER BY p.id_pedido DESC
    `, [req.usuario.id_usuario]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erro ao listar pedidos do usuário:', error.message);
    res.status(500).json({ success: false, message: 'Não foi possível carregar seus pedidos.' });
  }
});
app.post('/api/pedidos', autenticar, async (req, res) => {
  const { id_endereco = null, subtotal = 0, frete = 0, desconto = 0, valor_total = 0 } = req.body || {};
  try {
    const [clientes] = await pool.query(
      'SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1',
      [req.usuario.id_usuario]
    );
    const idCliente = clientes[0]?.id_cliente;
    if (!idCliente) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
    }

    const [result] = await pool.query(
      `INSERT INTO pedidos (id_cliente, id_endereco, subtotal, frete, desconto, valor_total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idCliente, id_endereco, Number(subtotal), Number(frete), Number(desconto), Number(valor_total)]
    );
    res.status(201).json({ success: true, data: { id_pedido: result.insertId } });
  } catch (error) {
    console.error('Erro ao criar pedido do usuário:', error.message);
    res.status(500).json({ success: false, message: 'Não foi possível finalizar o pedido.' });
  }
});
app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.'
  });
});

app.use((err, _req, res, _next) => {
  console.error('Erro interno da API:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.'
  });
});

async function startServer() {
  try {
    const conectado = await pingDatabase();
    if (conectado) {
      console.log('Banco de dados conectado com sucesso!');
    } else {
      console.log('Banco de dados indisponível no momento. Verifique as credenciais e o serviço MySQL.');
    }
  } catch (error) {
    console.error('Falha ao verificar a conexão com o banco:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor ARYN rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/api/status`);
  });
}

startServer();