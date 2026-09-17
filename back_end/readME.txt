ARYN - BACK-END

O back-end do projeto ARYN é a camada de aplicação responsável por expor a API REST, centralizar regras de negócio e garantir a comunicação entre a interface e o banco de dados MySQL.

Objetivo
- Expor endpoints para produtos, categorias, usuários, pedidos e carrinho
- Validar dados da aplicação
- Autenticar usuários
- Controlar acesso e regras de negócio da loja
- Interagir com o MySQL para persistência e consulta de dados

Tecnologias
- Node.js
- Express.js
- MySQL2
- dotenv
- cors
- bcrypt
- JWT
- morgan

Estrutura principal
- /server.js: ponto de entrada da aplicação
- /src/app.js: configuração do Express
- /src/config/database.js: conexão com o MySQL
- /src/controllers/: controladores da API
- /src/models/: modelos de acesso aos dados
- /src/routes/: endpoints e rotas da aplicação
- /src/middlewares/: autenticação, validação e tratamento de erros
- /package.json: scripts e dependências do projeto

Requisitos
- Node.js 18 ou superior
- npm
- MySQL 8 ou superior
- Banco já criado e populado

Configuração do ambiente
1. Entre na pasta do back-end:

   cd back_end

2. Instale as dependências:

   npm install

3. Crie o arquivo .env com as variáveis do banco e da aplicação. Exemplo:

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=aryn_v2
   PORT=3000
   JWT_SECRET=aryn_secret

4. Verifique se o MySQL está ativo antes de iniciar a aplicação.

Executando a API
Modo de desenvolvimento:

   npm run dev

Modo de produção:

   npm start

A aplicação ficará disponível, normalmente, em:
- http://localhost:3000

Endpoints principais
- GET /: status simples da API
- GET /api/status: validação da API e conexão com o banco
- GET /api/produtos
- GET /api/produtos/:id
- POST /api/produtos
- PUT /api/produtos/:id
- DELETE /api/produtos/:id
- GET /api/categorias
- POST /api/categorias
- GET /api/usuarios
- POST /api/usuarios
- POST /api/usuarios/login
- GET /api/carrinho
- POST /api/carrinho
- GET /api/pedidos
- POST /api/pedidos

Fluxo de funcionamento
1. O front-end faz uma requisição HTTP para a API.
2. A rota chama o controlador correspondente.
3. O controlador acessa o model ou a conexão com o banco.
4. A resposta é devolvida em JSON para o cliente.

Boas práticas
- Mantenha o .env fora do controle de versionamento.
- Não exponha credenciais em commit ou em código público.
- Use validação de dados antes de gravar no banco.
- Mantenha a estrutura modular para facilitar manutenção.

Observações
- O back-end depende da estrutura do banco importada em /banco_de_dados.
- O servidor deve estar disponível para que o front-end consiga consumir os dados.
