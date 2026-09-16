Back-end da API ARYN

## Requisitos

- Node.js 18 ou superior
- MySQL 8 ou superior
- Banco `aryn_database` criado com o script em `../banco_de_dados/backups/aryn_database.sql`

## Configuração

1. Copie `.env.example` para `.env`.
2. Preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` com as credenciais locais do MySQL.
3. Instale as dependências:

	```bash
	npm install
	```

## Execução

Desenvolvimento:

```bash
npm run dev
```

Produção/local:

```bash
npm start
```

## Validação

Com o servidor em execução, acesse:

- `GET http://localhost:3000/` para validar a API.
- `GET http://localhost:3000/api/status` para validar a API e a conexão MySQL.

O status retorna `banco: "conectado"` quando a consulta `SELECT 1` é bem-sucedida. Se o MySQL estiver indisponível, o servidor continua aceitando requisições e o endpoint informa `banco: "desconectado"`.