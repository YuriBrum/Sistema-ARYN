<?php
/* http://localhost:8081/teste_php_http.php */
header('Content-Type: application/json; charset=utf-8');
$dir = __DIR__ . '/back_end';
require $dir . '/conexao.php';
$q = 'SELECT p.id_produto, p.nome, p.preco, p.imagem
     FROM produtos p
     ORDER BY p.id_produto
     LIMIT 10';
$rows = $pdo->query($q)->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
  'ok' => true,
  'banco' => ($banco ?? 'aryn_database'),
  'server' => $_SERVER['SERVER_SOFTWARE'] ?? '',
  'porta_http' => $_SERVER['SERVER_PORT'] ?? '',
  'linhas' => count($rows),
  'produtos' => $rows
], JSON_UNESCAPED_UNICODE);
