const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const modernCartRoutes = require('./src/routes/carrinhoRoutes');
const colecaoRoutes = require('./routes/colecaoRoutes');
const { pingDatabase } = require('./config/database');

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