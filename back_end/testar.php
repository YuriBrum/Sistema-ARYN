<?php
/* =====================================================================
 * PÁGINA DE TESTE DA CONEXÃO — SISTEMA ARYN
 * Uso: coloque junto do conexao.php e abra no navegador.
 *      (rodar: php -S localhost:8080)
 * ===================================================================== */
require __DIR__ . '/conexao.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Conectado ao banco: aryn_database</h1>";

$tabelas = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);

if (!empty($tabelas)) {
    echo '<p>Tabelas encontradas:</p><ul>';
    foreach ($tabelas as $t) {
        echo '<li>' . htmlspecialchars($t) . '</li>';
    }
    echo '</ul>';
} else {
    echo '<p>Banco conectado, mas nenhuma tabela encontrada.</p>';
}
