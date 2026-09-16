# ARYN - SITE E CONTROLE DE ESTOQUE WEB

--------------------------------------------------------------------------

## 1. SOBRE O PROJETO

O projeto ARYN é uma loja virtual de roupas elegantes, desenvolvida para
representar um sistema completo de e-commerce com foco em identidade visual,
controle de estoque, cadastro de clientes, pedidos e gestão de produtos.

Ele foi pensado como um projeto integrador para demonstrar a conexão entre
Front-End, Back-End e Banco de Dados em uma aplicação web real.

As cores principais da marca são:
- Vermelho
- Preto
- Branco

--------------------------------------------------------------------------

## 2. OBJIVO DO SISTEMA

O sistema tem como objetivo:
- exibir produtos e categorias;
- permitir o cadastro e login de clientes;
- gerenciar carrinho de compras;
- registrar pedidos;
- controlar estoque de variações de produtos;
- oferecer estrutura para avaliação e favoritos;
- conectar a interface com uma API em Node.js e um banco MySQL.

--------------------------------------------------------------------------

## 3. TECNOLOGIAS UTILIZADAS

### Front-End
- HTML5
- CSS3
- JavaScript

### Back-End
- Node.js
- Express.js
- MySQL2
- dotenv
- cors
- morgan

### Banco de Dados
- MySQL

### Controle de versão
- Git
- GitHub

--------------------------------------------------------------------------

## 4. FUNCIONALIDADES PRINCIPAIS

- Catálogo de produtos
- Categorias de roupas
- Página de produtos e detalhes
- Login e cadastro de usuários
- Perfil do cliente
- Carrinho de compras
- Finalização de pedido
- Controle de estoque
- Avaliação de produtos
- Gestão de usuários, pedidos e categorias
- API REST para integração entre frontend e banco

--------------------------------------------------------------------------

## 5. ESTRUTURA DO PROJETO

ARYN/
|
+-- back_end/
|   +-- config/
|   |   +-- database.js
|   +-- controllers/
|   |   +-- categoriaController.js
|   |   +-- carrinhoController.js
|   |   +-- pedidoController.js
|   |   +-- produtoController.js
|   |   +-- statusController.js
|   |   +-- usuarioController.js
|   +-- routes/
|   |   +-- index.js
|   +-- .env
|   +-- .env.example
|   +-- .gitignore
|   +-- package.json
|   +-- server.js
|
+-- banco_de_dados/
|   +-- backups/
|   |   +-- aryn_database.sql
|   +-- tabelas/
|       +-- table_*.txt
|
+-- front_end/
|   +-- assets/
|   |   +-- images/
|   |   +-- js/
|   |   |   +-- autentificao.js
|   |   |   +-- carrinho.js
|   |   |   +-- curtida.js
|   |   |   +-- login.js
|   |   +-- styles/
|   |       +-- carrinho.css
|   |       +-- curtidas.css
|   |       +-- login.css
|   |       +-- usuario.css
|   +-- css/
|   |   +-- style.css
|   +-- js/
|   |   +-- script.js
|   +-- modelos/
|       +-- cadastro.html
|       +-- carrinho.html
|       +-- curtidas.html
|       +-- feminino.html
|       +-- masculino.html
|       +-- login.html
|       +-- usuarios.html
|
+-- index.html
+-- readME.txt
+
--------------------------------------------------------------------------

## 6. BANCO DE DADOS

O banco principal do projeto é:
- aryn_database

Arquivo SQL de base:
- banco_de_dados/backups/aryn_database.sql

O banco contém informações sobre:
- usuários
- clientes
- categorias
- produtos
- variações de produto
- tamanhos
- cores
- pedidos
- itens do pedido
- avaliações
- cupons
- pagamentos
- carrinho
- estoque
- logs do sistema

--------------------------------------------------------------------------

## 7. REQUISITOS DO SISTEMA

Antes de iniciar o projeto, verifique se o ambiente possui:
- Node.js
- npm
- MySQL Server
- Navegador web
- Git (opcional, mas recomendado)

--------------------------------------------------------------------------

## 8. CONFIGURAÇÃO DO BANCO DE DADOS

1. Inicie o MySQL no seu ambiente.
2. Crie o banco de dados chamado:
   aryn_database
3. Importe o arquivo SQL localizado em:
   banco_de_dados/backups/aryn_database.sql
4. Verifique se as tabelas foram criadas corretamente.

--------------------------------------------------------------------------

## 9. CONFIGURAÇÃO DO BACK-END

Entre na pasta do back-end:

cd back_end

Instale as dependências:

npm install

Crie ou ajuste o arquivo .env com as credenciais do banco:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=aryn_database
PORT=3000

Observação importante:
- O arquivo .env não deve ser enviado para o GitHub.
- O projeto já contém um arquivo .env.example como referência.

--------------------------------------------------------------------------

## 10. EXECUÇÃO DO PROJETO

### 10.1 Iniciando o Back-End

Na pasta back_end, execute:

npm start

Ou em modo de desenvolvimento:

npm run dev

Se tudo estiver correto, o servidor deve iniciar com mensagens parecidas com:

Banco de dados conectado com sucesso!
Servidor ARYN rodando na porta 3000

A API poderá ser acessada em:

http://localhost:3000/api/status

### 10.2 Verificando a API

A rota principal de status retorna informações do sistema:

GET http://localhost:3000/api/status

Exemplo de resposta:
{
  "success": true,
  "status": "online",
  "nome": "ARYN API",
  "banco": "conectado",
  "data": "2026-09-16T00:00:00.000Z"
}

--------------------------------------------------------------------------

## 11. ROTAS DA API

A API REST do sistema possui endpoints como:

### Status
- GET /api/status

### Categorias
- GET /api/categorias
- GET /api/categorias/:id
- POST /api/categorias

### Produtos
- GET /api/produtos
- GET /api/produtos/:id
- POST /api/produtos
- PUT /api/produtos/:id
- DELETE /api/produtos/:id

### Usuários
- GET /api/usuarios
- GET /api/usuarios/:id
- POST /api/usuarios
- POST /api/usuarios/login

### Pedidos
- GET /api/pedidos
- GET /api/pedidos/:id
- POST /api/pedidos

### Carrinho
- GET /api/carrinho
- POST /api/carrinho
- DELETE /api/carrinho/:id_item_carrinho

--------------------------------------------------------------------------

## 12. ARQUITETURA DO SISTEMA

O sistema segue uma arquitetura simples e organizada:

USUÁRIO
   |
   v
FRONT-END
   |
   v
BACK-END (Express.js)
   |
   v
BANCO DE DADOS (MySQL)

Essa estrutura permite que a interface envie requisições para a API,
que a API trate as regras de negócio e que o banco armazene os dados de
forma persistente.

--------------------------------------------------------------------------

## 13. FLUXO DE FUNCIONAMENTO

1. O usuário acessa a interface do site.
2. O Front-End envia requisições ao Back-End.
3. O Back-End valida dados e acessa o banco de dados.
4. O banco retorna as informações solicitadas.
5. A API responde ao Front-End em JSON.
6. A interface renderiza os dados para o usuário.

--------------------------------------------------------------------------

## 14. CONTROLE DE ESTOQUE

O projeto também contempla controle de estoque por variação de produto.
A estrutura do banco inclui tabelas como:
- variacoes_produto
- movimentacoes_estoque
- logs_sistema

Esse controle é importante para validar se um produto possui quantidade
suficiente antes de realizar vendas ou alterações de pedido.

--------------------------------------------------------------------------

## 15. BOAS PRÁTICAS DO PROJETO

- Não enviar o arquivo .env para o GitHub.
- Não publicar senhas ou credenciais no código.
- Manter o banco sempre sincronizado com o SQL do projeto.
- Validar dados antes de inserir no banco.
- Manter nomes e estrutura dos arquivos organizados.
- Realizar commits claros e frequentes.
- Testar as rotas antes de concluir alterações.

--------------------------------------------------------------------------

## 16. GIT E GITHUB

Verificar status:

git status

Adicionar arquivos:

git add .

Criar commit:

git commit -m "Descrição da alteração"

Enviar para o GitHub:

git push

Atualizar localmente:

git pull

Trocar de branch:

git checkout nome-da-branch

Merge:

git checkout main

git pull

git merge nome-da-branch

--------------------------------------------------------------------------

## 17. SOLUÇÃO DE PROBLEMAS

### Banco não conecta
- Verifique se o MySQL está rodando.
- Confirme as credenciais no arquivo .env.
- Verifique se o banco aryn_database foi criado.
- Confira se o SQL foi importado corretamente.

### Servidor não inicia
- Execute npm install na pasta back_end.
- Verifique se a porta 3000 está livre.
- Leia os erros exibidos no terminal.

### API não responde
- Confirme se o servidor está em execução.
- Teste a rota http://localhost:3000/api/status
- Verifique se o Node.js está instalado corretamente.

### Front-End não carrega dados
- Verifique se o back-end está ativo.
- Abra o console do navegador para identificar erros.
- Confira se a URL da API está correta.

--------------------------------------------------------------------------

## 18. STATUS ATUAL DO PROJETO

O projeto ARYN está em desenvolvimento e possui a base estrutural do
sistema implementada, incluindo:
- front-end em HTML/CSS/JS;
- back-end em Node.js/Express;
- API REST;
- conexão com banco MySQL;
- estrutura de produtos, usuários, pedidos e carrinho.

O projeto está pronto para evoluir com novas telas, autenticação mais
robusta, integração completa com o painel administrativo e melhorias na
experiência de compra.

--------------------------------------------------------------------------

## 19. FINALIDADE

O ARYN tem como finalidade consolidar a aprendizagem em desenvolvimento web,
com foco em integração entre interfaces, regras de negócio e banco de dados,
representando um sistema realista de e-commerce com gestão de loja.

--------------------------------------------------------------------------

## 20. OBSERVAÇÕES FINAIS

Este repositório está organizado para facilitar o entendimento e a evolução
do sistema. O Front-End fornece a experiência visual, o Back-End interpreta
as requisições e o MySQL armazena os dados de forma estruturada.

Para uma execução correta, é essencial manter o banco criado, o arquivo .env
configurado e o servidor do Back-End em execução.

--------------------------------------------------------------------------


Projeto desenvolvido para fins acadêmicos como Projeto Integrador do curso
Técnico em Análise e Desenvolvimento de Sistemas.

=====================================
ARYN - SITE E CONTROLE DE ESTOQUE WEB
Projeto Integrador - 2026
=====================================
