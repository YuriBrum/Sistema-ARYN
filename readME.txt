ARYN - SITE E CONTROLE DE ESTOQUE WEB

Visão geral
O projeto ARYN é uma loja virtual de moda masculina premium, estruturada para funcionar como um e-commerce completo, com foco em catálogo, identidade visual, controle de estoque, usuários, pedidos e integração entre front-end, back-end e banco de dados.

Objetivo principal
- Apresentar uma loja com visual sofisticado e comercial
- Gerenciar catálogo de produtos e categorias
- Controlar usuários, favoritos, carrinho e pedidos
- Integrar a interface web com API em Node.js e banco MySQL
- Simular um ambiente real de e-commerce com arquitetura modular

Tecnologias principais
Front-end
- HTML5
- CSS3
- JavaScript

Back-end
- Node.js
- Express.js
- MySQL2
- dotenv
- CORS
- JWT
- bcrypt

Banco de dados
- MySQL

Estrutura do repositório
- /back_end: API e regras de negócio
- /front_end: interface do cliente e assets visuais
- /banco_de_dados: estrutura do banco, backups e documentação
- /index.html: página inicial do projeto
- /readME.txt: documentação geral da aplicação

Fluxo da aplicação
1. O cliente acessa as páginas do site.
2. O front-end envia requisições para a API.
3. O back-end valida regras de negócio e consulta o banco.
4. O MySQL retorna os dados.
5. A interface renderiza os resultados para o cliente.

Requisitos mínimos
- Node.js 18 ou superior
- npm
- MySQL 8 ou superior
- Navegador moderno
- Git

Como iniciar o projeto
1. Crie e restaure o banco de dados a partir do arquivo em /banco_de_dados.
2. Configure o arquivo .env do back-end em /back_end.
3. Instale as dependências:

   cd back_end
   npm install

4. Inicie a API:

   npm run dev

5. Abra o front-end em um servidor local:

   cd ..
   python -m http.server 8000

6. Acesse:
   http://localhost:8000/

Arquitetura funcional
- Front-end: páginas de loja, catálogo, filtros e interações do cliente
- Back-end: autenticação, produtos, categorias, pedidos e carrinho
- Banco de dados: persistência dos dados da operação comercial

Principais módulos do sistema
- Catálogo de produtos
- Categorias
- Coleções
- Novidades
- Ofertas
- Login e cadastro
- Favoritos
- Carrinho
- Gestão de pedidos
- Controle de estoque
- API REST para integração entre frontend e banco

Observações importantes
- O arquivo .env do back-end não deve ser compartilhado publicamente.
- O banco deve estar ativo antes de iniciar a API.
- O front-end depende da API para carregar dados reais.
- A aplicação foi organizada em camadas para facilitar manutenção e evolução.

Documentação complementar
- /back_end/readME.txt: detalhes da API e configuração do servidor
- /front_end/readME.txt: detalhes das páginas e arquivos visuais
- /banco_de_dados/readME.txt: estrutura e importação do banco de dados
