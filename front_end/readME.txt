ARYN - FRONT-END

O front-end do projeto ARYN é responsável por apresentar a loja, os produtos, as categorias, os filtros, os detalhes de compra, os fluxos de login/cadastro e a experiência geral do cliente.

Objetivo
- Exibir a identidade visual da marca ARYN.
- Apresentar catálogo, ofertas, novidades e coleções.
- Permitir busca, filtros e navegação comercial.
- Integrar-se com a API do back-end para carregar produtos e dados dinâmicos.
- Dar suporte ao fluxo de login, carrinho, favoritos e checkout.

Tecnologias
- HTML5
- CSS3
- JavaScript puro
- Consumo de API via fetch

Estrutura principal
- index.html: página inicial
- categorias.html: catálogo por categoria
- colecoes.html: páginas de coleção
- novidades.html: itens recentes
- ofertas.html: produtos em promoção
- front_end/modelos/: páginas de detalhe, login, cadastro, usuário, carrinho, favoritos e termos
- front_end/assets/styles/: estilos do layout
- front_end/assets/js/: scripts interativos da interface
- front_end/js/api.js: helper central de conexão com a API

Como executar
1. Certifique-se de que o back-end está em execução.
2. A partir da pasta raiz do projeto, abra os arquivos HTML no navegador ou utilize um servidor local simples:

   python -m http.server 8000

3. Acesse:
   http://localhost:8000/
   ou diretamente qualquer página .html do projeto.

Conexão com a API
- O front-end consome a API em http://localhost:3000/api
- O arquivo front_end/js/api.js define a base da URL e envia os dados em JSON
- É recomendado manter o back-end e o front-end em execução simultaneamente durante o desenvolvimento

Páginas principais
- Home: apresentação da marca e destaques
- Categorias: navegação e filtros de itens por tipo
- Coleções: páginas temáticas / campanhas
- Novidades: produtos recém-adicionados
- Ofertas: produtos com desconto real
- Login/Cadastro: autenticação e criação de conta
- Carrinho e favoritos: interação do cliente com o catálogo

Observações
- O projeto foi construído como front-end estático com comportamento dinâmico em JavaScript.
- A interface depende da API e do banco para dados reais.
- Antes de testar fluxos completos, configure o back-end e o MySQL.
