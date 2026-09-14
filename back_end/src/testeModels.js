require('dotenv').config();

const Usuario = require('./models/usuarioModel');
const Cliente = require('./models/clienteModel');
const Categoria = require('./models/categoriaModel');
const Produto = require('./models/produtoModel');

async function testar() {

    try {

        console.log('\n=== USUÁRIOS ===');
        console.log(await Usuario.listarTodos());

        console.log('\n=== CLIENTES ===');
        console.log(await Cliente.listarTodos());

        console.log('\n=== CATEGORIAS ===');
        console.log(await Categoria.listarTodas());

        console.log('\n=== PRODUTOS ===');
        console.log(await Produto.listarTodos());

        console.log('\nTestes concluídos com sucesso!');

    } catch (erro) {

        console.error('\nErro durante os testes:');
        console.error(erro.message);

    } finally {

        process.exit();

    }

}

testar();