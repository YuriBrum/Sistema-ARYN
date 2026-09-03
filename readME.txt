# ARYN - SITE E CONTROLE DE ESTOQUE WEB

--------------------------------------------------------------------------

## 1. SOBRE O PROJETO

O ARYN é um sistema web de vendas de roupas elegantes, desenvolvido como
Projeto Integrador do curso Técnico em Análise e Desenvolvimento de Sistemas.

O sistema integra FRONT-END, BACK-END e BANCO DE DADOS para permitir o
gerenciamento de produtos, clientes, pedidos, avaliações e estoque.

Cores principais:

* Vermelho
* Preto
* Branco

--------------------------------------------------------------------------

## 2. TECNOLOGIAS

### Front-End:

* HTML5
* CSS3
* JavaScript

### Back-End:

* Node.js
* Express.js

### Banco de Dados:

* MySQL

### Versionamento:

* Git
* GitHub

--------------------------------------------------------------------------

## 3. PRINCIPAIS FUNCIONALIDADES

* Exibição de produtos
* Categorias masculina e feminina
* Página de detalhes dos produtos
* Cadastro e gerenciamento de usuários
* Login
* Carrinho de compras
* Criação de pedidos
* Itens dos pedidos
* Avaliação de produtos
* Controle de estoque
* Comunicação entre Front-End e Back-End
* Armazenamento dos dados no MySQL

--------------------------------------------------------------------------

## 4. ESTRUTURA DO PROJETO

ARYN/
|
+-- back_end/
|   +-- config/
|   +-- controllers/
|   +-- models/
|   +-- routes/
|   +-- server.js
|   +-- package.json
|   +-- .env
|
+-- front_end/
|   +-- css/
|   |   +-- style.css
|   +-- js/
|   |   +-- script.js
|   +-- pages/
|   |   +-- carrinho.html
|   |   +-- feminino.html
|   |   +-- masculino.html
|   |   +-- usuario.html
|   +-- index.html
|
+-- banco_de_dados/
|   +-- aryn_database.sql
|
+-- README.txt
+-- .gitignore

--------------------------------------------------------------------------

## 5. BANCO DE DADOS

```
Nome do banco:
aryn_database

Arquivo SQL:
banco_de_dados/aryn_database.sql
```

O banco armazena informações relacionadas a clientes, produtos, pedidos,
itens dos pedidos, avaliações e estoque.

O arquivo SQL deve ser atualizado sempre que houver alterações importantes
na estrutura do banco.

--------------------------------------------------------------------------

## 6. CONFIGURAÇÃO

### REQUISITOS:
        * Node.js
        * npm
        * MySQL
        * Navegador web
        * Git (recomendado)

### BANCO DE DADOS:
        1. Inicie o MySQL.
        2. Crie o banco "aryn_database".
        3. Importe o arquivo "aryn_database.sql".

### BACK-END:
        Entre na pasta:
            cd back_end
        Instale as dependências:
            npm install

        Configure o arquivo ".env" com os dados do MySQL.
            ```
            DB_HOST=localhost
            DB_USER=root
            DB_PASSWORD=sua_senha
            DB_NAME=aryn_database
            PORT=3000
            ```
        IMPORTANTE:
            O arquivo ".env" não deve ser enviado para o GitHub.

--------------------------------------------------------------------------

## 7. EXECUÇÃO
    Dentro da pasta "back_end", execute:
        npm start

    O servidor será executado na porta:
        ```
        3000
        ```

    Mensagens esperadas:
        ```
        Banco de dados conectado com sucesso!
        Servidor ARYN rodando na porta 3000
        ```

    Depois, acesse o sistema pelo navegador através do endereço configurado
    para o servidor.
        ```
        http://localhost:3000/api/status
        ```

--------------------------------------------------------------------------

## 8. ARQUITETURA

O funcionamento básico do sistema é:

        ```
     USUÁRIO
        |
        v
     FRONT-END
    HTML + CSS + JavaScript
        |
        v
    BACK-END
    Node.js + Express
        |
        v
    BANCO DE DADOS
       MySQL
        ```

O Front-End apresenta a interface e envia as requisições.
O Back-End processa as requisições e aplica as regras do sistema.
O MySQL armazena os dados.

--------------------------------------------------------------------------

## 9. CONTROLE DE ESTOQUE

O sistema possui controle de estoque dos produtos.

O estoque deve ser atualizado de acordo com as operações realizadas,
principalmente durante o processo de venda.

Antes de finalizar uma compra, a disponibilidade dos produtos deve ser
verificada.

--------------------------------------------------------------------------

## 10. GIT E GITHUB

    Verificar alterações:
        ```
        git status
        ```

    Adicionar arquivos:
        ```
        git add .
        ```

    Criar commit:
        ```
        git commit -m "Descrição da alteração"
        ```

    Enviar para o GitHub:
        ```
        git push
        ```

    Atualizar o projeto:
        ```
        git pull
        ```

    Trocar de branch:
        ```
        git checkout nome-da-branch
        ```

    Realizar merge:
        ```
        git checkout master
        git pull
        git merge nome-da-branch
        ```

--------------------------------------------------------------------------

## 11. BOAS PRÁTICAS

    * Não enviar o arquivo .env para o GitHub.
    * Não colocar senhas diretamente no código.
    * Manter o banco de dados atualizado.
    * Testar as alterações antes do merge.
    * Utilizar commits claros.
    * Manter Front-End, Back-End e Banco de Dados organizados.
    * Validar os dados recebidos pelo sistema.
    * Manter o projeto versionado.

--------------------------------------------------------------------------

## 12. SOLUÇÃO DE PROBLEMAS

### BANCO NÃO CONECTA:
        * Verifique se o MySQL está funcionando.
        * Confira os dados do arquivo .env.
        * Verifique se "aryn_database" existe.
        * Confirme se o SQL foi importado corretamente.

### SERVIDOR NÃO INICIA:
        * Execute "npm install".
        * Verifique se a porta 3000 está disponível.
        * Confira os erros apresentados no terminal.

### SITE NÃO FUNCIONA:
        * Verifique se o servidor está ativo.
        * Confira a URL e a porta da API.
        * Verifique o console do navegador.
        * Confira se as rotas do Back-End estão funcionando.

--------------------------------------------------------------------------

## 13. STATUS DO PROJETO

O ARYN está em desenvolvimento.

O projeto envolve a integração de:

    * Front-End
    * Back-End
    * API
    * Banco de Dados
    * Sistema de pedidos
    * Carrinho
    * Avaliações
    * Controle de estoque
    * Git/GitHub

--------------------------------------------------------------------------

14. FINALIDADE

Projeto desenvolvido para fins acadêmicos como Projeto Integrador do curso
Técnico em Análise e Desenvolvimento de Sistemas.

=====================================
ARYN - SITE E CONTROLE DE ESTOQUE WEB
Projeto Integrador - 2026
=====================================
