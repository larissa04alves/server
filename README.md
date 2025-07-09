# NWL Agents

Projeto desenvolvido durante o evento **NLW (Next Level Week)** da **Rocketseat**.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - ORM moderno para TypeScript
- **PostgreSQL** com extensão pgvector
- **Zod** - Validação de schemas
- **Docker** - Containerização do banco de dados
- **Biome** - Linting e formatação

## 📁 Estrutura do Projeto

```
src/
├── db/           # Configuração do banco de dados
│   ├── schema/   # Schemas das tabelas
│   ├── migrations/ # Migrações
│   └── seed.ts   # População inicial do banco
├── http/         # Rotas HTTP
│   └── routes/   # Definição das rotas
├── env.ts        # Configuração de variáveis de ambiente
└── server.ts     # Servidor principal
```

## ⚙️ Configuração e Setup

### 1. Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### 2. Clonar o repositório

```bash
git clone <repository-url>
cd server
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
```

### 5. Iniciar o banco de dados

```bash
docker-compose up -d
```

### 6. Executar migrações e popular o banco

```bash
npx drizzle-kit migrate
npm run db:seed
```

### 7. Iniciar o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints

- `GET /health` - Health check da aplicação
- `GET /rooms` - Lista todas as salas

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm start` - Inicia o servidor em modo produção
- `npm run db:seed` - Executa migrações e popula o banco de dados

## 🔧 Padrões Utilizados

- **Arquitetura em camadas** - Separação entre rotas, banco de dados e lógica de negócio
- **Type Safety** - Uso do TypeScript e Zod para validação de tipos
- **Migrations** - Controle de versão do banco de dados com Drizzle
- **Containerização** - Uso do Docker para isolamento do ambiente de banco de dados
