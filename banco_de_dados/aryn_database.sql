-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 31/08/2026 às 16:09
-- Versão do servidor: 10.4.27-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `aryn_database`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacoes_produto`
--

CREATE TABLE `avaliacoes_produto` (
  `id_avaliacao` int(10) UNSIGNED NOT NULL,
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `id_produto` int(10) UNSIGNED NOT NULL,
  `nota` tinyint(3) UNSIGNED NOT NULL,
  `comentario` varchar(1000) DEFAULT NULL,
  `status` enum('PENDENTE','APROVADA','REJEITADA') NOT NULL DEFAULT 'PENDENTE',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Despejando dados para a tabela `avaliacoes_produto`
--

INSERT INTO `avaliacoes_produto` (`id_avaliacao`, `id_cliente`, `id_produto`, `nota`, `comentario`, `status`, `criado_em`, `atualizado_em`) VALUES
(1, 1, 1, 5, 'Produto excelente e muito confortável.', 'PENDENTE', '2026-08-31 10:18:22', '2026-08-31 10:18:22');

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinhos`
--

CREATE TABLE `carrinhos` (
  `id_carrinho` int(10) UNSIGNED NOT NULL,
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinhos`
--

INSERT INTO `carrinhos` (`id_carrinho`, `id_cliente`, `criado_em`, `atualizado_em`) VALUES
(1, 1, '2026-08-31 10:09:01', '2026-08-31 10:09:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nome`, `descricao`, `status`, `criado_em`) VALUES
(1, 'Ternos', 'Ternos elegantes para ocasiões formais.', 1, '2026-08-31 09:52:31'),
(2, 'Blazers', 'Blazers elegantes para diferentes ocasiões.', 1, '2026-08-31 09:52:31'),
(3, 'Camisas Sociais', 'Camisas sociais para ocasiões formais e profissionais.', 1, '2026-08-31 09:52:31'),
(4, 'Camisas Polo', 'Camisas polo para um estilo elegante e casual.', 1, '2026-08-31 09:52:31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `id_usuario`, `cpf`, `telefone`, `data_nascimento`, `criado_em`) VALUES
(1, 1, '123.456.789-00', '(51) 99999-9999', '2005-03-15', '2026-08-31 09:48:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cores`
--

CREATE TABLE `cores` (
  `id_cor` int(10) UNSIGNED NOT NULL,
  `nome` varchar(50) NOT NULL,
  `codigo_hex` char(7) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cores`
--

INSERT INTO `cores` (`id_cor`, `nome`, `codigo_hex`, `status`, `criado_em`) VALUES
(1, 'Preto', '#000000', 1, '2026-08-31 09:57:40'),
(2, 'Branco', '#FFFFFF', 1, '2026-08-31 09:57:40'),
(3, 'Azul', '#0000FF', 1, '2026-08-31 09:57:40'),
(4, 'Cinza', '#808080', 1, '2026-08-31 09:57:40'),
(5, 'Marrom', '#8B4513', 1, '2026-08-31 09:57:40'),
(6, 'Bege', '#F5F5DC', 1, '2026-08-31 09:57:40'),
(7, 'Vermelho', '#FF0000', 1, '2026-08-31 09:57:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cupons`
--

CREATE TABLE `cupons` (
  `id_cupom` int(10) UNSIGNED NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `tipo_desconto` enum('PERCENTUAL','VALOR_FIXO') NOT NULL,
  `valor_desconto` decimal(10,2) NOT NULL,
  `valor_minimo` decimal(10,2) NOT NULL DEFAULT 0.00,
  `limite_uso` int(10) UNSIGNED DEFAULT NULL,
  `quantidade_utilizada` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `inicio_validade` datetime NOT NULL,
  `fim_validade` datetime NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Despejando dados para a tabela `cupons`
--

INSERT INTO `cupons` (`id_cupom`, `codigo`, `tipo_desconto`, `valor_desconto`, `valor_minimo`, `limite_uso`, `quantidade_utilizada`, `inicio_validade`, `fim_validade`, `ativo`, `criado_em`, `atualizado_em`) VALUES
(1, 'ARYN10', 'PERCENTUAL', 10.00, 300.00, 100, 0, '2026-08-31 00:00:00', '2026-12-31 23:59:59', 1, '2026-08-31 10:20:12', '2026-08-31 10:20:12');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cupons_pedido`
--

CREATE TABLE `cupons_pedido` (
  `id_cupom_pedido` int(10) UNSIGNED NOT NULL,
  `id_cupom` int(10) UNSIGNED NOT NULL,
  `id_pedido` int(10) UNSIGNED NOT NULL,
  `codigo_cupom` varchar(50) NOT NULL,
  `valor_desconto` decimal(10,2) NOT NULL,
  `utilizado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `enderecos`
--

CREATE TABLE `enderecos` (
  `id_endereco` int(10) UNSIGNED NOT NULL,
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `cep` varchar(9) NOT NULL,
  `logradouro` varchar(150) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) NOT NULL,
  `principal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `enderecos`
--

INSERT INTO `enderecos` (`id_endereco`, `id_cliente`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `principal`) VALUES
(1, 1, '90000-000', 'Rua Exemplo', '100', 'Apto 202', 'Centro', 'Porto Alegre', 'RS', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `favoritos`
--

CREATE TABLE `favoritos` (
  `id_favorito` int(10) UNSIGNED NOT NULL,
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `id_produto` int(10) UNSIGNED NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `favoritos`
--

INSERT INTO `favoritos` (`id_favorito`, `id_cliente`, `id_produto`, `criado_em`) VALUES
(1, 1, 1, '2026-08-31 10:17:58');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_carrinho`
--

CREATE TABLE `itens_carrinho` (
  `id_item_carrinho` int(10) UNSIGNED NOT NULL,
  `id_carrinho` int(10) UNSIGNED NOT NULL,
  `id_variacao` int(10) UNSIGNED NOT NULL,
  `quantidade` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `adicionado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itens_carrinho`
--

INSERT INTO `itens_carrinho` (`id_item_carrinho`, `id_carrinho`, `id_variacao`, `quantidade`, `adicionado_em`) VALUES
(1, 1, 1, 2, '2026-08-31 10:09:22');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_pedido`
--

CREATE TABLE `itens_pedido` (
  `id_item` int(10) UNSIGNED NOT NULL,
  `id_pedido` int(10) UNSIGNED NOT NULL,
  `id_variacao` int(10) UNSIGNED NOT NULL,
  `quantidade` int(10) UNSIGNED NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itens_pedido`
--

INSERT INTO `itens_pedido` (`id_item`, `id_pedido`, `id_variacao`, `quantidade`, `preco_unitario`, `subtotal`, `criado_em`) VALUES
(1, 1, 1, 1, 899.90, 899.90, '2026-08-31 10:03:31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `logs_sistema`
--

CREATE TABLE `logs_sistema` (
  `id_log` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `acao` varchar(100) NOT NULL,
  `tabela_afetada` varchar(100) DEFAULT NULL,
  `id_registro` bigint(20) UNSIGNED DEFAULT NULL,
  `dados_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_anteriores`)),
  `dados_novos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dados_novos`)),
  `ip_origem` varchar(45) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `logs_sistema`
--

INSERT INTO `logs_sistema` (`id_log`, `id_usuario`, `acao`, `tabela_afetada`, `id_registro`, `dados_anteriores`, `dados_novos`, `ip_origem`, `criado_em`) VALUES
(1, 1, 'ALTERAR_ESTOQUE', 'variacoes_produto', 1, '{\"estoque\": 5}', '{\"estoque\": 15}', NULL, '2026-08-31 10:23:13');

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacoes_estoque`
--

CREATE TABLE `movimentacoes_estoque` (
  `id_movimentacao` int(10) UNSIGNED NOT NULL,
  `id_variacao` int(10) UNSIGNED NOT NULL,
  `tipo` enum('ENTRADA','SAIDA','AJUSTE','DEVOLUCAO') NOT NULL,
  `quantidade` int(10) UNSIGNED NOT NULL,
  `estoque_anterior` int(10) UNSIGNED NOT NULL,
  `estoque_posterior` int(10) UNSIGNED NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `id_pedido` int(10) UNSIGNED DEFAULT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `movimentacoes_estoque`
--

INSERT INTO `movimentacoes_estoque` (`id_movimentacao`, `id_variacao`, `tipo`, `quantidade`, `estoque_anterior`, `estoque_posterior`, `motivo`, `id_pedido`, `id_usuario`, `criado_em`) VALUES
(1, 1, 'ENTRADA', 10, 5, 15, 'Reposição de estoque', NULL, 1, '2026-08-31 10:05:06');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamentos`
--

CREATE TABLE `pagamentos` (
  `id_pagamento` int(10) UNSIGNED NOT NULL,
  `id_pedido` int(10) UNSIGNED NOT NULL,
  `metodo` enum('PIX','CARTAO_CREDITO','CARTAO_DEBITO','BOLETO') NOT NULL,
  `status` enum('PENDENTE','PROCESSANDO','APROVADO','RECUSADO','CANCELADO','ESTORNADO') NOT NULL DEFAULT 'PENDENTE',
  `valor` decimal(10,2) NOT NULL,
  `codigo_transacao` varchar(100) DEFAULT NULL,
  `parcelas` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `pago_em` datetime DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pagamentos`
--

INSERT INTO `pagamentos` (`id_pagamento`, `id_pedido`, `metodo`, `status`, `valor`, `codigo_transacao`, `parcelas`, `pago_em`, `criado_em`, `atualizado_em`) VALUES
(1, 1, 'PIX', 'APROVADO', 924.90, 'PIX-TESTE-000001', 1, '2026-08-31 10:07:11', '2026-08-31 10:07:11', '2026-08-31 10:07:11');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(10) UNSIGNED NOT NULL,
  `id_cliente` int(10) UNSIGNED NOT NULL,
  `id_endereco` int(10) UNSIGNED NOT NULL,
  `status` enum('PENDENTE','PAGO','SEPARANDO','ENVIADO','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `frete` decimal(10,2) NOT NULL DEFAULT 0.00,
  `desconto` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_cliente`, `id_endereco`, `status`, `subtotal`, `frete`, `desconto`, `total`, `criado_em`, `atualizado_em`) VALUES
(1, 1, 1, 'PENDENTE', 899.90, 25.00, 0.00, 924.90, '2026-08-31 10:01:56', '2026-08-31 10:01:56');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

CREATE TABLE `produtos` (
  `id_produto` int(10) UNSIGNED NOT NULL,
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id_produto`, `id_categoria`, `nome`, `descricao`, `preco`, `imagem`, `status`, `criado_em`, `atualizado_em`) VALUES
(1, 1, 'Terno Slim Preto', 'Terno slim preto em tecido premium, com acabamento elegante e confortável.', 899.90, 'uploads/produtos/terno-slim-preto.jpg', 1, '2026-08-31 09:54:28', '2026-08-31 09:54:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tamanhos`
--

CREATE TABLE `tamanhos` (
  `id_tamanho` int(10) UNSIGNED NOT NULL,
  `nome` varchar(10) NOT NULL,
  `ordem` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tamanhos`
--

INSERT INTO `tamanhos` (`id_tamanho`, `nome`, `ordem`, `status`, `criado_em`) VALUES
(1, 'PP', 1, 1, '2026-08-31 09:56:13'),
(2, 'P', 2, 1, '2026-08-31 09:56:13'),
(3, 'M', 3, 1, '2026-08-31 09:56:13'),
(4, 'G', 4, 1, '2026-08-31 09:56:13'),
(5, 'GG', 5, 1, '2026-08-31 09:56:13'),
(6, 'XG', 6, 1, '2026-08-31 09:56:13');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('CLIENTE','ADMIN') NOT NULL DEFAULT 'CLIENTE',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `email`, `senha`, `tipo`, `status`, `criado_em`, `atualizado_em`) VALUES
(1, 'Usuario Teste', 'teste@aryn.com', 'HASH_TESTE', 'CLIENTE', 1, '2026-08-31 09:47:17', '2026-08-31 09:47:17');

-- --------------------------------------------------------

--
-- Estrutura para tabela `variacoes_produto`
--

CREATE TABLE `variacoes_produto` (
  `id_variacao` int(10) UNSIGNED NOT NULL,
  `id_produto` int(10) UNSIGNED NOT NULL,
  `id_tamanho` int(10) UNSIGNED NOT NULL,
  `id_cor` int(10) UNSIGNED NOT NULL,
  `sku` varchar(50) NOT NULL,
  `estoque` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `preco` decimal(10,2) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `variacoes_produto`
--

INSERT INTO `variacoes_produto` (`id_variacao`, `id_produto`, `id_tamanho`, `id_cor`, `sku`, `estoque`, `preco`, `status`, `criado_em`, `atualizado_em`) VALUES
(1, 1, 3, 1, 'TER-SLI-M-PTO', 15, NULL, 1, '2026-08-31 09:59:36', '2026-08-31 10:05:33'),
(2, 1, 2, 1, 'TER-SLI-P-PTO', 3, NULL, 1, '2026-08-31 10:00:29', '2026-08-31 10:00:29'),
(3, 1, 4, 1, 'TER-SLI-G-PTO', 2, NULL, 1, '2026-08-31 10:00:29', '2026-08-31 10:00:29'),
(4, 1, 3, 3, 'TER-SLI-M-AZU', 4, NULL, 1, '2026-08-31 10:00:29', '2026-08-31 10:00:29'),
(5, 1, 4, 3, 'TER-SLI-G-AZU', 6, NULL, 1, '2026-08-31 10:00:29', '2026-08-31 10:00:29');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `avaliacoes_produto`
--
ALTER TABLE `avaliacoes_produto`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD UNIQUE KEY `uk_avaliacao_cliente_produto` (`id_cliente`,`id_produto`),
  ADD KEY `idx_avaliacoes_produto` (`id_produto`),
  ADD KEY `idx_avaliacoes_status` (`status`);

--
-- Índices de tabela `carrinhos`
--
ALTER TABLE `carrinhos`
  ADD PRIMARY KEY (`id_carrinho`),
  ADD UNIQUE KEY `uk_carrinho_cliente` (`id_cliente`),
  ADD UNIQUE KEY `idx_carrinhos_cliente` (`id_cliente`);

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Índices de tabela `cores`
--
ALTER TABLE `cores`
  ADD PRIMARY KEY (`id_cor`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `cupons`
--
ALTER TABLE `cupons`
  ADD PRIMARY KEY (`id_cupom`),
  ADD UNIQUE KEY `uk_cupom_codigo` (`codigo`),
  ADD KEY `idx_cupons_ativo` (`ativo`),
  ADD KEY `idx_cupons_validade` (`inicio_validade`,`fim_validade`);

--
-- Índices de tabela `cupons_pedido`
--
ALTER TABLE `cupons_pedido`
  ADD PRIMARY KEY (`id_cupom_pedido`),
  ADD UNIQUE KEY `uk_cupom_pedido` (`id_cupom`,`id_pedido`),
  ADD KEY `idx_cupons_pedido_cupom` (`id_cupom`),
  ADD KEY `idx_cupons_pedido_pedido` (`id_pedido`);

--
-- Índices de tabela `enderecos`
--
ALTER TABLE `enderecos`
  ADD PRIMARY KEY (`id_endereco`),
  ADD KEY `fk_enderecos_cliente` (`id_cliente`);

--
-- Índices de tabela `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id_favorito`),
  ADD UNIQUE KEY `uk_favorito_cliente_produto` (`id_cliente`,`id_produto`),
  ADD KEY `idx_favoritos_cliente` (`id_cliente`),
  ADD KEY `idx_favoritos_produto` (`id_produto`);

--
-- Índices de tabela `itens_carrinho`
--
ALTER TABLE `itens_carrinho`
  ADD PRIMARY KEY (`id_item_carrinho`),
  ADD UNIQUE KEY `uk_carrinho_variacao` (`id_carrinho`,`id_variacao`),
  ADD KEY `idx_itens_carrinho_carrinho` (`id_carrinho`),
  ADD KEY `idx_itens_carrinho_variacao` (`id_variacao`);

--
-- Índices de tabela `itens_pedido`
--
ALTER TABLE `itens_pedido`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `idx_itens_pedido_pedido` (`id_pedido`),
  ADD KEY `idx_itens_pedido_variacao` (`id_variacao`);

--
-- Índices de tabela `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `idx_logs_usuario` (`id_usuario`),
  ADD KEY `idx_logs_acao` (`acao`),
  ADD KEY `idx_logs_data` (`criado_em`);

--
-- Índices de tabela `movimentacoes_estoque`
--
ALTER TABLE `movimentacoes_estoque`
  ADD PRIMARY KEY (`id_movimentacao`),
  ADD KEY `fk_movimentacao_pedido` (`id_pedido`),
  ADD KEY `fk_movimentacao_usuario` (`id_usuario`),
  ADD KEY `idx_movimentacoes_variacao` (`id_variacao`),
  ADD KEY `idx_movimentacoes_tipo` (`tipo`),
  ADD KEY `idx_movimentacoes_data` (`criado_em`);

--
-- Índices de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD UNIQUE KEY `codigo_transacao` (`codigo_transacao`),
  ADD KEY `idx_pagamentos_status` (`status`),
  ADD KEY `idx_pagamentos_pedido` (`id_pedido`);

--
-- Índices de tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_pedidos_endereco` (`id_endereco`),
  ADD KEY `idx_pedidos_cliente` (`id_cliente`),
  ADD KEY `idx_pedidos_status` (`status`),
  ADD KEY `idx_pedidos_criado_em` (`criado_em`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `idx_produtos_nome` (`nome`),
  ADD KEY `idx_produtos_categoria` (`id_categoria`);

--
-- Índices de tabela `tamanhos`
--
ALTER TABLE `tamanhos`
  ADD PRIMARY KEY (`id_tamanho`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `variacoes_produto`
--
ALTER TABLE `variacoes_produto`
  ADD PRIMARY KEY (`id_variacao`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `uk_produto_tamanho_cor` (`id_produto`,`id_tamanho`,`id_cor`),
  ADD UNIQUE KEY `idx_variacoes_sku` (`sku`),
  ADD KEY `idx_variacoes_produto` (`id_produto`),
  ADD KEY `idx_variacoes_tamanho` (`id_tamanho`),
  ADD KEY `idx_variacoes_cor` (`id_cor`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `avaliacoes_produto`
--
ALTER TABLE `avaliacoes_produto`
  MODIFY `id_avaliacao` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `carrinhos`
--
ALTER TABLE `carrinhos`
  MODIFY `id_carrinho` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `cores`
--
ALTER TABLE `cores`
  MODIFY `id_cor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `cupons`
--
ALTER TABLE `cupons`
  MODIFY `id_cupom` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cupons_pedido`
--
ALTER TABLE `cupons_pedido`
  MODIFY `id_cupom_pedido` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `enderecos`
--
ALTER TABLE `enderecos`
  MODIFY `id_endereco` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id_favorito` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `itens_carrinho`
--
ALTER TABLE `itens_carrinho`
  MODIFY `id_item_carrinho` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `itens_pedido`
--
ALTER TABLE `itens_pedido`
  MODIFY `id_item` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `logs_sistema`
--
ALTER TABLE `logs_sistema`
  MODIFY `id_log` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `movimentacoes_estoque`
--
ALTER TABLE `movimentacoes_estoque`
  MODIFY `id_movimentacao` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pagamentos`
--
ALTER TABLE `pagamentos`
  MODIFY `id_pagamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id_produto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `tamanhos`
--
ALTER TABLE `tamanhos`
  MODIFY `id_tamanho` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `variacoes_produto`
--
ALTER TABLE `variacoes_produto`
  MODIFY `id_variacao` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `avaliacoes_produto`
--
ALTER TABLE `avaliacoes_produto`
  ADD CONSTRAINT `fk_avaliacoes_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_avaliacoes_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE;

--
-- Restrições para tabelas `carrinhos`
--
ALTER TABLE `carrinhos`
  ADD CONSTRAINT `fk_carrinhos_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Restrições para tabelas `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_clientes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Restrições para tabelas `cupons_pedido`
--
ALTER TABLE `cupons_pedido`
  ADD CONSTRAINT `fk_cupons_pedido_cupom` FOREIGN KEY (`id_cupom`) REFERENCES `cupons` (`id_cupom`),
  ADD CONSTRAINT `fk_cupons_pedido_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`);

--
-- Restrições para tabelas `enderecos`
--
ALTER TABLE `enderecos`
  ADD CONSTRAINT `fk_enderecos_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Restrições para tabelas `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favoritos_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE;

--
-- Restrições para tabelas `itens_carrinho`
--
ALTER TABLE `itens_carrinho`
  ADD CONSTRAINT `fk_itens_carrinho_carrinho` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinhos` (`id_carrinho`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_itens_carrinho_variacao` FOREIGN KEY (`id_variacao`) REFERENCES `variacoes_produto` (`id_variacao`);

--
-- Restrições para tabelas `itens_pedido`
--
ALTER TABLE `itens_pedido`
  ADD CONSTRAINT `fk_itens_pedido_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `fk_itens_pedido_variacao` FOREIGN KEY (`id_variacao`) REFERENCES `variacoes_produto` (`id_variacao`);

--
-- Restrições para tabelas `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD CONSTRAINT `fk_logs_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Restrições para tabelas `movimentacoes_estoque`
--
ALTER TABLE `movimentacoes_estoque`
  ADD CONSTRAINT `fk_movimentacao_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `fk_movimentacao_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `fk_movimentacao_variacao` FOREIGN KEY (`id_variacao`) REFERENCES `variacoes_produto` (`id_variacao`);

--
-- Restrições para tabelas `pagamentos`
--
ALTER TABLE `pagamentos`
  ADD CONSTRAINT `fk_pagamentos_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`);

--
-- Restrições para tabelas `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `fk_pedidos_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `enderecos` (`id_endereco`);

--
-- Restrições para tabelas `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `fk_produtos_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);

--
-- Restrições para tabelas `variacoes_produto`
--
ALTER TABLE `variacoes_produto`
  ADD CONSTRAINT `fk_variacoes_cor` FOREIGN KEY (`id_cor`) REFERENCES `cores` (`id_cor`),
  ADD CONSTRAINT `fk_variacoes_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  ADD CONSTRAINT `fk_variacoes_tamanho` FOREIGN KEY (`id_tamanho`) REFERENCES `tamanhos` (`id_tamanho`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
