<?php
/* ---------------------------------------------------------------------
 * TESTE SERVER-SIDE — Sistema ARYN (Apache + PHP + MariaDB)
 * Abra: http://localhost:8081/index_php_teste.php
 * --------------------------------------------------------------------- */
header('Content-Type: text/html; charset=utf-8');
require __DIR__ . '/back_end/conexao.php';

echo "<h1>ARYN — PHP server-side rodando</h1>";
echo "<p><b>Servidor:</b> " . htmlspecialchars($_SERVER['SERVER_SOFTWARE'] ?? '') . "</p>";
echo "<p><b>PHP:</b> " . PHP_VERSION . " (XAMPP " . phpversion('core') . ")</p>";

try {
    $tabelas = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "<p><b>Banco:</b> aryn_database — OK, tabelas:</p><ul>";
    foreach ($tabelas as $t) echo "<li>" . htmlspecialchars($t) . "</li>";
    echo "</ul>";
} catch (Throwable $e) {
    echo "<p style='color:#a00'>Erro: " . htmlspecialchars($e->getMessage()) . "</p>";
}
