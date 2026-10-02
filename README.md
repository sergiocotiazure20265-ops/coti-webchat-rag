# COTI WebChat RAG

Aplicação de atendimento com inteligência artificial: backend Java com Spring Boot e Spring AI e frontend Angular.

## Estrutura

- `backend/`: API RAG, armazenamento vetorial no PostgreSQL/PGVector e memória de conversas no MongoDB.
- `frontend/`: chat com componentes standalone, validações, histórico visual e detalhes das respostas.

Os dois projetos ficam no mesmo repositório (monorepo), com dependências e execução independentes.

## Pré-requisitos

- Java 21.
- Node.js e npm compatíveis com a versão Angular indicada em `frontend/package.json`.
- Docker com Docker Compose.
- Chave OpenAI configurada somente no backend.

## Backend

No PowerShell, a partir da raiz do repositório:

```powershell
cd backend
docker compose up -d
$env:OPENAI_API_KEY = 'SUA_CHAVE_OPENAI'
.\mvnw.cmd spring-boot:run
```

No Linux/macOS, use `export OPENAI_API_KEY='SUA_CHAVE_OPENAI'` e `sh mvnw spring-boot:run`.

A API executa em `http://localhost:8081`. O Compose fornece PostgreSQL na porta 5435 e MongoDB na porta 27018. As credenciais padrão do Compose são apenas para desenvolvimento local. A configuração da API aceita `POSTGRES_PASSWORD` e `MONGODB_PASSWORD`, com os mesmos valores locais padrão do Compose.

O script `backend/src/main/resources/schema.sql` define a tabela de consumo de IA; em uma base nova, execute-o caso ela ainda não exista:

```powershell
Get-Content .\src\main\resources\schema.sql -Raw | docker exec -i api-rag-pgvector psql -U postgres -d bd_rag
```

### Endpoints

- `POST /api/rag`: atendimento.
- `POST /api/conhecimentos`: armazenamento de um texto na base vetorial.

Exemplo de pergunta:

```json
{
  "nomeUsuario": "Sergio",
  "pergunta": "Tem curso de Java?"
}
```

Exemplo de cadastro de conhecimento; substitua o conteúdo por informações oficiais:

```json
{
  "texto": "Conteúdo sobre um curso da COTI, com informações verificadas de programa, valores ou horários."
}
```

Cada cadastro adiciona um documento à base. Envie um assunto por chamada.

## Frontend

Em outro terminal:

```powershell
cd frontend
npm ci
npm start
```

Abra `http://localhost:4200`. Também é possível executar `npx ng s -o`: o proxy está configurado no `angular.json` e encaminha `/api` para a API na porta 8081.

O chat mantém o nome durante a conversa e o histórico visual até recarregar a página. A memória persistida fica no backend. A configuração de proxy evita a necessidade de CORS no desenvolvimento local.

## Verificação

Na pasta `frontend`:

```powershell
npm run build
npm test -- --watch=false
```

Não versione chaves, arquivos `.env`, dependências instaladas, arquivos compilados ou dados dos bancos.
