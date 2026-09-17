ARYN - BACK-END

O back-end do projeto ARYN é a camada de aplicação responsável por expor a API REST,
centralizar as regras de negócio e conectar o front-end ao banco de dados MySQL.

Tecnologias utilizadas
- Node.js
- Express.js
- MySQL
- JavaScript (CommonJS)
- JWT para autenticação
- bcrypt para hash de senhas
- dotenv para variáveis de ambiente
- cors para comunicação entre origens
- morgan para logs HTTP
- nodemon para desenvolvimento

Requisitos para executar o projeto

Obrigatórios
- Node.js 18 ou superior, preferencialmente a versão LTS
- npm, instalado junto com o Node.js
- MySQL Server 8 ou superior
- Navegador moderno para acessar o front-end

Recomendados
- Git
- MySQL Workbench ou outro cliente MySQL para criar o banco e importar o backup
- Python 3, apenas se for utilizado `python -m http.server` para servir o front-end

Não é necessário instalar globalmente Express, MySQL2, bcrypt, JWT, dotenv,
cors, morgan ou nodemon. Todas as bibliotecas do back-end são instaladas
localmente pelo `npm install` usando o arquivo `package.json`.

Bibliotecas npm utilizadas

Dependências de produção:
- `express`: servidor HTTP e roteamento da API
- `mysql2`: conexão e consultas ao MySQL
- `dotenv`: carregamento das variáveis do arquivo `.env`
- `cors`: configuração de acesso entre front-end e API
- `bcrypt`: hash e validação de senhas
- `jsonwebtoken`: criação e validação de tokens JWT
- `morgan`: registro das requisições HTTP

Dependências de desenvolvimento:
- `nodemon`: reinicialização automática do servidor durante o desenvolvimento

Estrutura principal
- `/server.js`: entrada principal da API e servidor HTTP
- `/src/app.js`: configuração alternativa do Express
- `/config/database.js`: pool de conexão usado pelo servidor principal
- `/src/config/database.js`: configuração de banco usada pelos módulos modernos
- `/controllers/`: controllers da API legada
- `/src/controllers/`: controllers dos módulos modernos
- `/routes/`: rotas da API legada
- `/src/routes/`: rotas dos módulos modernos
- `/src/middlewares/`: autenticação, autorização, validação e tratamento de erros
- `/models/` e `/src/models/`: acesso e persistência de dados
- `/package.json`: scripts e dependências npm

Instalação

1. Instale o Node.js LTS:

   https://nodejs.org/

2. Instale o MySQL Server 8 ou superior:

   https://dev.mysql.com/downloads/mysql/

3. Entre na pasta do back-end:

   cd back_end

4. Instale todas as bibliotecas do projeto:

   npm install

5. Confirme a instalação:

   node --version
   npm --version
   npm ls --depth=0

Configuração do banco de dados

1. Inicie o serviço do MySQL.

2. Crie o banco e importe a estrutura disponível em:

   `/banco_de_dados/backups/aryn_v2.sql`

   A importação pode ser feita pelo MySQL Workbench ou pelo cliente MySQL.

3. Crie um usuário MySQL para a aplicação e conceda acesso ao banco `aryn_v2`.
   Execute estes comandos conectado como administrador do MySQL:

   CREATE DATABASE IF NOT EXISTS aryn_v2
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;

   CREATE USER IF NOT EXISTS 'aryn_admin'@'localhost'
     IDENTIFIED BY 'defina_uma_senha_segura';

   GRANT ALL PRIVILEGES ON aryn_v2.*
     TO 'aryn_admin'@'localhost';

   CREATE USER IF NOT EXISTS 'aryn_admin'@'127.0.0.1'
     IDENTIFIED BY 'defina_uma_senha_segura';

   GRANT ALL PRIVILEGES ON aryn_v2.*
     TO 'aryn_admin'@'127.0.0.1';

   FLUSH PRIVILEGES;

   Substitua `defina_uma_senha_segura` pela mesma senha configurada no `.env`.

4. Crie `back_end/.env` com suas credenciais locais. Exemplo:

   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=aryn_admin
   DB_PASSWORD=sua_senha
   DB_NAME=aryn_v2
   JWT_SECRET=gere_um_segredo_longo_e_aleatorio
   JWT_EXPIRES_IN=8h

   Nunca publique o arquivo `.env` nem coloque credenciais reais em commits.

Executando a API

Modo de desenvolvimento:

   cd back_end
   npm run dev

Modo de produção:

   cd back_end
   npm start

A API ficará disponível, normalmente, em:

   http://localhost:3000

Verificação rápida:

   http://localhost:3000/api/status

Se o status indicar banco desconectado, verifique se:
- o serviço MySQL está em execução;
- host e porta estão corretos;
- o banco `aryn_v2` existe;
- o usuário possui privilégios no banco;
- a senha do `.env` corresponde à senha do usuário MySQL;
- o arquivo `.env` está dentro de `/back_end`.

Executando o front-end

O front-end não possui dependências npm próprias. Ele usa HTML, CSS e JavaScript
diretamente no navegador, mas precisa ser servido por HTTP para evitar problemas
com requisições e caminhos de arquivos.

Com Python:

   cd ..
   python -m http.server 8000

Depois acesse:

   http://localhost:8000/

A API deve continuar executando em outra janela na porta 3000.

Principais endpoints

Autenticação:
- `POST /api/auth/cadastro`
- `POST /api/auth/login`
- `GET /api/auth/perfil`

Produtos e categorias:
- `GET /api/produtos`
- `GET /api/produtos/:id`
- `GET /api/produtos/novidades`
- `GET /api/produtos/ofertas`
- `GET /api/categorias`

Coleções:
- `GET /api/colecoes`
- `GET /api/colecoes/:slug`
- `GET /api/colecoes/:slug/produtos`

Carrinho autenticado:
- `GET /api/carrinho`
- `POST /api/carrinho/itens`
- `PATCH /api/carrinho/itens/:id`
- `DELETE /api/carrinho/itens/:id`
- `DELETE /api/carrinho`

Favoritos autenticados:
- `GET /api/favoritos`
- `POST /api/favoritos`
- `DELETE /api/favoritos/:produtoId`
- `GET /api/favoritos/:produtoId/verificar`

Pedidos:
- `GET /api/pedidos/me`
- `POST /api/pedidos`

Os endpoints autenticados exigem:

   Authorization: Bearer SEU_TOKEN_JWT

Fluxo de funcionamento
1. O navegador acessa uma página do front-end.
2. O front-end envia uma requisição HTTP para a API.
3. A API valida os dados recebidos.
4. O middleware valida o token e as permissões quando necessário.
5. O controller executa a regra de negócio.
6. O model consulta ou altera o MySQL.
7. A API devolve uma resposta JSON ao front-end.

Boas práticas
- Mantenha o `.env` fora do controle de versão.
- Não exponha senhas, tokens JWT ou credenciais em código público.
- Use uma senha forte para o usuário do MySQL.
- Use um `JWT_SECRET` longo e exclusivo em cada ambiente.
- Execute `npm install` sempre que o `package.json` for alterado.
- Não instale dependências globalmente sem necessidade.
- Faça backup do banco antes de alterações estruturais.
