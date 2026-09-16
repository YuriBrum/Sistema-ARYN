<?php
$dsn = "mysql:host=127.0.0.1;port=3306;dbname=aryn_database;charset=utf8mb4";
$pdo = new PDO($dsn, "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$total = $pdo->query("SELECT COUNT(*) FROM produtos")->fetchColumn();
$rows = $pdo->query("SELECT id, nome, preco FROM produtos ORDER BY id LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
echo "QTD_PRODUTOS=$total\n";
foreach ($rows as $r) { echo "P|{$r['id']}|{$r['nome']}|{$r['preco']}\n"; }
