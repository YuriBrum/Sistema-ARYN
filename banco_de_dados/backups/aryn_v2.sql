-- ARYN - schema compatível com back_end/src
-- Execute somente depois de fazer backup do banco atual.
-- Este script recria as tabelas da aplicação usando InnoDB; ele não cria
-- nem altera usuários do MySQL.

CREATE DATABASE IF NOT EXISTS aryn_v2
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE aryn_v2;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS logs_sistema;
DROP TABLE IF EXISTS movimentacoes_estoque;
DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS cupons_pedido;
DROP TABLE IF EXISTS itens_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS carrinho_itens;
DROP TABLE IF EXISTS carrinhos;
DROP TABLE IF EXISTS avaliacoes_produto;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS enderecos;
DROP TABLE IF EXISTS variacoes_produto;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS tamanhos;
DROP TABLE IF EXISTS cores;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS cupons;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE',
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uk_usuarios_email (email),
    KEY idx_usuarios_tipo_status (tipo, status)
) ENGINE=InnoDB;

CREATE TABLE clientes (
    id_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    cpf VARCHAR(14) NULL,
    telefone VARCHAR(20) NULL,
    data_nascimento DATE NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cliente),
    UNIQUE KEY uk_clientes_usuario (id_usuario),
    UNIQUE KEY uk_clientes_cpf (cpf),
    CONSTRAINT fk_clientes_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE categorias (
    id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_categoria),
    UNIQUE KEY uk_categorias_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE produtos (
    id_produto INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_categoria INT UNSIGNED NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255) NULL,
    estoque INT UNSIGNED NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_produto),
    KEY idx_produtos_categoria (id_categoria),
    KEY idx_produtos_nome (nome),
    CONSTRAINT fk_produtos_categoria FOREIGN KEY (id_categoria)
        REFERENCES categorias (id_categoria)
) ENGINE=InnoDB;

CREATE TABLE cores (
    id_cor INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    codigo_hex CHAR(7) NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cor),
    UNIQUE KEY uk_cores_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE tamanhos (
    id_tamanho INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(10) NOT NULL,
    ordem INT UNSIGNED NOT NULL DEFAULT 0,
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tamanho),
    UNIQUE KEY uk_tamanhos_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE variacoes_produto (
    id_variacao INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_produto INT UNSIGNED NOT NULL,
    id_tamanho INT UNSIGNED NOT NULL,
    id_cor INT UNSIGNED NOT NULL,
    sku VARCHAR(50) NOT NULL,
    estoque INT UNSIGNED NOT NULL DEFAULT 0,
    preco DECIMAL(10,2) NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_variacao),
    UNIQUE KEY uk_variacoes_sku (sku),
    UNIQUE KEY uk_variacoes_produto_tamanho_cor (id_produto, id_tamanho, id_cor),
    CONSTRAINT fk_variacoes_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto),
    CONSTRAINT fk_variacoes_tamanho FOREIGN KEY (id_tamanho)
        REFERENCES tamanhos (id_tamanho),
    CONSTRAINT fk_variacoes_cor FOREIGN KEY (id_cor)
        REFERENCES cores (id_cor)
) ENGINE=InnoDB;

CREATE TABLE enderecos (
    id_endereco INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    principal TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id_endereco),
    KEY idx_enderecos_cliente (id_cliente),
    CONSTRAINT fk_enderecos_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE favoritos (
    id_favorito INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_favorito),
    UNIQUE KEY uk_favoritos_cliente_produto (id_cliente, id_produto),
    CONSTRAINT fk_favoritos_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_favoritos_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carrinhos (
    id_carrinho INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    status ENUM('ATIVO', 'FINALIZADO', 'ABANDONADO') NOT NULL DEFAULT 'ATIVO',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_carrinho),
    UNIQUE KEY uk_carrinhos_cliente (id_cliente),
    CONSTRAINT fk_carrinhos_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carrinho_itens (
    id_item INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_carrinho INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_item),
    UNIQUE KEY uk_carrinho_produto (id_carrinho, id_produto),
    CONSTRAINT fk_carrinho_itens_carrinho FOREIGN KEY (id_carrinho)
        REFERENCES carrinhos (id_carrinho) ON DELETE CASCADE,
    CONSTRAINT fk_carrinho_itens_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto)
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    id_pedido INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    id_endereco INT UNSIGNED NULL,
    status ENUM('PENDENTE', 'PAGO', 'SEPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    desconto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_pedido),
    KEY idx_pedidos_cliente_status (id_cliente, status),
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente),
    CONSTRAINT fk_pedidos_endereco FOREIGN KEY (id_endereco)
        REFERENCES enderecos (id_endereco) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE itens_pedido (
    id_item_pedido INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_pedido INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_item_pedido),
    KEY idx_itens_pedido_pedido (id_pedido),
    CONSTRAINT fk_itens_pedido_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_itens_pedido_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto)
) ENGINE=InnoDB;

CREATE TABLE pagamentos (
    id_pagamento INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_pedido INT UNSIGNED NOT NULL,
    metodo ENUM('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO') NOT NULL,
    status ENUM('PENDENTE', 'PROCESSANDO', 'APROVADO', 'RECUSADO', 'CANCELADO', 'ESTORNADO') NOT NULL DEFAULT 'PENDENTE',
    valor DECIMAL(10,2) NOT NULL,
    codigo_transacao VARCHAR(100) NULL,
    parcelas TINYINT UNSIGNED NOT NULL DEFAULT 1,
    pago_em DATETIME NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_pagamento),
    UNIQUE KEY uk_pagamentos_transacao (codigo_transacao),
    KEY idx_pagamentos_pedido (id_pedido),
    CONSTRAINT fk_pagamentos_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE avaliacoes_produto (
    id_avaliacao INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cliente INT UNSIGNED NOT NULL,
    id_produto INT UNSIGNED NOT NULL,
    nota TINYINT UNSIGNED NOT NULL,
    comentario VARCHAR(1000) NULL,
    status ENUM('PENDENTE', 'APROVADA', 'REJEITADA') NOT NULL DEFAULT 'PENDENTE',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_avaliacao),
    UNIQUE KEY uk_avaliacoes_cliente_produto (id_cliente, id_produto),
    CONSTRAINT fk_avaliacoes_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacoes_produto FOREIGN KEY (id_produto)
        REFERENCES produtos (id_produto) ON DELETE CASCADE,
    CONSTRAINT ck_avaliacoes_nota CHECK (nota BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE cupons (
    id_cupom INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL,
    tipo_desconto ENUM('PERCENTUAL', 'VALOR_FIXO') NOT NULL,
    valor_desconto DECIMAL(10,2) NOT NULL,
    valor_minimo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    limite_uso INT UNSIGNED NULL,
    quantidade_utilizada INT UNSIGNED NOT NULL DEFAULT 0,
    inicio_validade DATETIME NOT NULL,
    fim_validade DATETIME NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cupom),
    UNIQUE KEY uk_cupons_codigo (codigo)
) ENGINE=InnoDB;

CREATE TABLE cupons_pedido (
    id_cupom_pedido INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_cupom INT UNSIGNED NOT NULL,
    id_pedido INT UNSIGNED NOT NULL,
    codigo_cupom VARCHAR(50) NOT NULL,
    valor_desconto DECIMAL(10,2) NOT NULL,
    utilizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_cupom_pedido),
    UNIQUE KEY uk_cupons_pedido (id_cupom, id_pedido),
    CONSTRAINT fk_cupons_pedido_cupom FOREIGN KEY (id_cupom)
        REFERENCES cupons (id_cupom),
    CONSTRAINT fk_cupons_pedido_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE movimentacoes_estoque (
    id_movimentacao INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_variacao INT UNSIGNED NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA', 'AJUSTE', 'DEVOLUCAO') NOT NULL,
    quantidade INT UNSIGNED NOT NULL,
    estoque_anterior INT UNSIGNED NOT NULL,
    estoque_posterior INT UNSIGNED NOT NULL,
    motivo VARCHAR(255) NULL,
    id_pedido INT UNSIGNED NULL,
    id_usuario INT UNSIGNED NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_movimentacao),
    KEY idx_movimentacoes_variacao_data (id_variacao, criado_em),
    CONSTRAINT fk_movimentacoes_variacao FOREIGN KEY (id_variacao)
        REFERENCES variacoes_produto (id_variacao),
    CONSTRAINT fk_movimentacoes_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido) ON DELETE SET NULL,
    CONSTRAINT fk_movimentacoes_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE logs_sistema (
    id_log BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NULL,
    acao VARCHAR(100) NOT NULL,
    tabela_afetada VARCHAR(100) NULL,
    id_registro BIGINT UNSIGNED NULL,
    dados_anteriores JSON NULL,
    dados_novos JSON NULL,
    ip_origem VARCHAR(45) NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_log),
    KEY idx_logs_usuario_data (id_usuario, criado_em),
    CONSTRAINT fk_logs_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO categorias (nome, descricao) VALUES
    ('Ternos', 'Ternos elegantes para ocasioes formais.'),
    ('Blazers', 'Blazers para diferentes ocasioes.'),
    ('Camisas Sociais', 'Camisas sociais para ocasioes formais e profissionais.'),
    ('Camisas Polo', 'Camisas polo para um estilo elegante e casual.');

INSERT INTO tamanhos (nome, ordem) VALUES
    ('PP', 1), ('P', 2), ('M', 3), ('G', 4), ('GG', 5), ('XG', 6);

INSERT INTO cores (nome, codigo_hex) VALUES
    ('Preto', '#000000'), ('Branco', '#FFFFFF'), ('Azul', '#0000FF'),
    ('Cinza', '#808080'), ('Marrom', '#8B4513'), ('Bege', '#F5F5DC'),
    ('Vermelho', '#FF0000');

-- Crie administradores pela API para que a senha seja armazenada com bcrypt.