ARYN - BANCO DE DADOS

O banco de dados do projeto ARYN é responsável pela persistência de produtos, categorias, usuários, pedidos, estoque, carrinho, pagamentos, cupons, avaliações e dados do cliente.

Objetivo
- Armazenar os dados da loja e do sistema
- Garantir integridade de produtos e pedidos
- Suportar categorias, estoque, clientes e movimentações
- Permitir a API consultar e registrar informações comerciais

Tecnologias
- MySQL

Estrutura da pasta
- /banco_de_dados/backups: arquivo principal de restaurar a base
- /banco_de_dados/tabelas: documentação das tabelas e campos principais

Arquivos principais
- backups/aryn_v2.sql: dump principal do banco
- tabelas/table_produtos.txt
- tabelas/table_categorias.txt
- tabelas/table_usuarios.txt
- tabelas/table_clientes.txt
- tabelas/table_pedidos.txt
- tabelas/table_itens_pedido.txt
- tabelas/table_carrinho.txt
- tabelas/table_carrinho_itens.txt
- tabelas/table_favoritos.txt
- tabelas/table_estoque.txt
- tabelas/table_variacoes_produtos.txt
- tabelas/table_pagamentos.txt
- tabelas/table_avaliacoes_produto.txt
- tabelas/table_tamanhos.txt
- tabelas/table_cores.txt

Banco principal
O nome do banco pode variar de ambiente para ambiente. O projeto geralmente utiliza o valor configurado em .env do back-end, como por exemplo:

   DB_NAME=aryn_v2

Se o ambiente local usar outro nome, ajuste o valor em /back_end/.env.

Como restaurar o banco
1. Certifique-se de que o MySQL está instalado e em execução.
2. Crie o banco de dados desejado.
3. Importe o arquivo SQL da pasta /banco_de_dados/backups.

Exemplo:

   mysql -u root -p
   CREATE DATABASE aryn_v2;
   USE aryn_v2;
   SOURCE C:/caminho/para/aryn_v2.sql;

Ou via ferramenta visual do MySQL Workbench / DBeaver.

Principais áreas de dados
- Usuários e clientes
- Produtos e categorias
- Variações, tamanhos e cores
- Estoque e movimentações
- Carrinho e itens do carrinho
- Favoritos
- Pedidos e itens de pedido
- Pagamentos e cupons
- Avaliações de produtos
- Logs do sistema

Relacionamentos principais
- produtos -> categorias
- clientes -> usuários
- pedidos -> clientes e usuários
- itens_pedido -> pedidos e produtos
- variacoes_produtos -> produtos
- carrinho -> usuários
- favoritos -> usuários e produtos
- avaliacoes_produto -> usuários e produtos

Boas práticas
- Faça backup antes de alterar estrutura ou dados
- Mantenha nomes e tipos de campos consistentes com a API
- Atualize o SQL quando houver mudanças na modelagem
- Documente alterações de schema em versões futuras

Observações
- A estrutura do banco está organizada para suportar um e-commerce completo.
- O back-end depende desta base para consultas, autenticação, estoque e pedidos.
