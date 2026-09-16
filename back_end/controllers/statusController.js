const { pingDatabase } = require('../config/database');

async function getStatus(req, res) {
  try {
    const bancoConectado = await pingDatabase();

    res.json({
      success: true,
      status: 'online',
      nome: 'ARYN API',
      banco: bancoConectado ? 'conectado' : 'desconectado',
      data: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Erro ao verificar status da API.',
      details: error.message
    });
  }
}

module.exports = {
  getStatus
};
