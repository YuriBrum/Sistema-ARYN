<?php
/* =====================================================================
 * ARYN — TESTE DA PILHA (Apache + PHP + MariaDB) 
 * Acesse: http://localhost:8081/teste_stack.php
 * Este arquivo fica na RAIZ do projeto, junto do index.html.
 * ===================================================================== */
header('Content-Type: text/html; charset=utf-8');
echo "<!DOCTYPE html><html lang='pt-BR'><meta charset='UTF-8'><body>";
echo "<h1>ARYN — pilha rodando no XAMPP</h1>";
echo "<p><b>Servidor web:</b> " . htmlspecialchars($_SERVER['SERVER_SOFTWARE'] ?? '?') . "</p>";
echo "<p><b>Porta:</b> " . htmlspecialchars($_SERVER['SERVER_PORT'] ?? '?') . "</p>";
echo "<p><b>DocumentRoot:</b> " . htmlspecialchars($_SERVER['DOCUMENT_ROOT'] ?? '?') . "</p>";

$conexaoFile = __DIR__ . '/back_end/conexao.php';
if (is_file($conexaoFile)) {
    require $conexaoFile;
    echo "<p><b>banco:</b> aryn_database — <span style='color:green'><b>CONEXÃO OK via PDO</b></span></p>";
    try {
        $tabelas = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
        echo "<p><b>Tabelas (" . count($tabelas) . "):</b> <code>" . htmlspecialchars(implode(', ', $tabelas)) . "</code></p>";
        $versao = $pdo->query('SELECT VERSION()')->fetchColumn();
        echo "<p><b>Versão MariaDB:</b> " . htmlspecialchars($versao) . "</p>";
    } catch (Throwable $e) {
        echo "<p style='color:#a00'>Erro consulta: " . htmlspecialchars($e->getMessage()) . "</p>";
    }
} else {
    echo "<p style='color:#a00'>conexao.php não encontrado em " . htmlspecialchars($conexaoFile) . "</p>";
}
echo "</body></html>";
