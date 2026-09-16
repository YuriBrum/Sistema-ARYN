const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const { pingDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    nome: 'ARYN API',
    status: 'online',
    mensagem: 'API do sistema ARYN pronta para receber requisições.'
  });
});

app.use('/api', routes);

app.use((err, _req, res, _next) => {
  console.error('Erro interno da API:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
    details: err.message
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
