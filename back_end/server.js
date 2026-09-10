require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const conexao = await pool.getConnection();

        console.log('Banco de dados conectado com sucesso!');

        conexao.release();

        app.listen(PORT, () => {
            console.log(`Servidor ARYN rodando na porta ${PORT}`);
        });

    } catch (erro) {
        console.error('Erro ao conectar ao banco de dados:');
        console.error(erro.message);

        process.exit(1);
    }
}

iniciarServidor();