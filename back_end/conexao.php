<?php
/* =====================================================================
 * CONEXÃO COM O BANCO DE DADOS — SISTEMA ARYN
 * Credenciais iguais às do back_end (.env): aryn_admin / AryN@2026_Admin
 * Banco: aryn_database | MySQL 8 | porta 3306
 * ===================================================================== */

$host     = '127.0.0.1';
$porta    = 3306;
$usuario  = 'aryn_admin';
$senha    = 'AryN@2026_Admin';
$banco    = 'aryn_database';

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$porta;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit('Erro ao conectar ao banco: ' . $e->getMessage());
}
?>
