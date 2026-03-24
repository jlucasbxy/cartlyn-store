# Cartlyn Store - Plataforma de E-commerce

Uma plataforma completa de e-commerce desenvolvida com Next.js 15, TypeScript e Prisma, permitindo que vendedores gerenciem produtos e clientes realizem compras.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Decisões de Arquitetura](#decisões-de-arquitetura)

## 🎯 Sobre o Projeto

Cartlyn Store é uma aplicação full-stack de e-commerce que permite:
- Vendedores cadastrarem e gerenciarem seus produtos
- Clientes navegarem, favoritarem e comprarem produtos
- Sistema completo de autenticação e autorização
- Upload de produtos via CSV
- Dashboard para vendedores com métricas

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15.5.6** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **React Toastify** - Notificações
- **Next-Auth** - Autenticação

### Backend
- **Next.js API Routes** - Backend separado via rotas API
- **Prisma 7** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis / ioredis** - Cache e rate limiting
- **argon2** - Hash de senhas
- **Zod** - Validação de dados
- **Pino** - Logging estruturado
- **rate-limiter-flexible** - Rate limiting
- **PapaParse** - Parsing de arquivos CSV
- **Nodemailer** - Envio de e-mails transacionais
- **React Email** - Templates de e-mail
- **Swagger/OpenAPI** - Documentação de API

### Qualidade de Código
- **Biome** - Linter e formatter

## 🏗️ Arquitetura

### Separação Frontend/Backend

Este projeto utiliza **API Routes do Next.js** para criar uma clara separação entre frontend e backend, atendendo ao requisito de backend separado:

#### Backend (API Routes)
- **Localização:** `/app/api/*`
- **Função:** Todas as operações de banco de dados, lógica de negócio e validações
- **Comunicação:** RESTful API com JSON
- **Autenticação:** Server-side com Next-Auth

```
/app/api/
├── auth/          # Autenticação e registro
├── products/      # CRUD de produtos (com bulk import)
├── health/        # Health check
└── docs/          # Documentação OpenAPI (Swagger)
```

#### Frontend (Client Components + Server Actions)
- **Localização:** `/app/*` (pages) e `/components/*`
- **Função:** Interface do usuário e experiência
- **Comunicação:** Server Actions para cart e favorites; client-side fetch para demais operações
- **Estado:** React Hooks e custom hooks

### Arquitetura em Camadas (Backend)

O backend segue uma arquitetura em camadas clara:

```
API Route → Service → Repository → Prisma Client → PostgreSQL
```

- **Schemas (`/schemas`)** — Validação de entrada com Zod
- **DTOs (`/dtos`)** — Contratos de request/response tipados
- **Services (`/services`)** — Lógica de negócio
- **Repositories (`/repositories`)** — Acesso a dados (queries Prisma)
- **Errors (`/errors`)** — Erros de domínio customizados

## ✨ Funcionalidades

### Para Clientes
- ✅ Cadastro e login
- ✅ Recuperação de senha por e-mail
- ✅ Navegação de produtos com busca e filtros
- ✅ Adicionar produtos ao carrinho
- ✅ Favoritar produtos
- ✅ Finalizar compra
- ✅ Visualizar histórico de pedidos
- ✅ Excluir conta (preservando histórico)

### Para Vendedores
- ✅ Cadastro e login
- ✅ Criar, editar e excluir produtos
- ✅ Upload de produtos via CSV
- ✅ Dashboard com estatísticas
- ✅ Visualizar pedidos recebidos
- ✅ Desativar conta (oculta todos os produtos)

### Recursos Técnicos
- ✅ Autenticação JWT via Next-Auth
- ✅ Validação de dados com Zod
- ✅ Soft delete para usuários e produtos
- ✅ Paginação de resultados
- ✅ Rate limiting com Redis
- ✅ Logging estruturado com Pino
- ✅ Envio de e-mails transacionais (recuperação de senha)
- ✅ Documentação de API com Swagger
- ✅ Dark mode
- ✅ Design responsivo
- ✅ TypeScript em toda a aplicação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Redis
- npm ou yarn

### Passos

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cartlyn-store
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Configure o banco de dados no arquivo `.env`

5. Execute as migrations do Prisma
```bash
npx prisma migrate dev
```

6. Popule o banco de dados (opcional)
```bash
npx prisma db seed
```

7. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

8. Acesse a aplicação em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://cartlyn:cartlyn123@localhost:5432/cartlyn_store?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"

# SMTP (dev: mailpit em localhost:1025)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_USER="mailpit"
SMTP_PASS="mailpit"
EMAIL_FROM="Cartlyn Store <no-reply@cartlyn.local>"

NODE_ENV="development"

# Log level (opcional, padrão "info"; deve ser "warn" em produção)
LOG_LEVEL="info"

# Rate limiter (points = máx requisições, duration = janela em segundos)
RATE_LIMIT_STRICTEST_POINTS=5
RATE_LIMIT_STRICTEST_DURATION=900
RATE_LIMIT_STRICT_POINTS=10
RATE_LIMIT_STRICT_DURATION=900
RATE_LIMIT_MODERATE_POINTS=20
RATE_LIMIT_MODERATE_DURATION=60
RATE_LIMIT_DEFAULT_POINTS=60
RATE_LIMIT_DEFAULT_DURATION=60
```

### Banco de Dados e Redis

O projeto utiliza PostgreSQL e Redis. Você pode subir ambos via docker-compose:

```bash
docker compose up -d
```

## 📁 Estrutura de Pastas

```
cartlyn-store/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend - API Routes
│   │   ├── auth/                 # Autenticação e registro
│   │   ├── products/             # CRUD Produtos + bulk import
│   │   ├── health/               # Health check
│   │   └── docs/                 # Documentação OpenAPI
│   ├── actions/                  # Server Actions (cart, favorites)
│   ├── (auth)/                   # Páginas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api-docs/                 # Página de documentação Swagger
│   ├── products/[id]/            # Detalhes do produto
│   ├── seller/                   # Páginas do vendedor
│   │   ├── products/
│   │   └── dashboard/
│   ├── store/                    # Loja (listagem)
│   ├── cart/                     # Página do carrinho
│   ├── orders/                   # Histórico de pedidos
│   ├── favorites/                # Produtos favoritos
│   ├── settings/                 # Configurações da conta
│   ├── error.tsx                 # Página de erro
│   ├── not-found.tsx             # Página 404
│   └── layout.tsx                # Layout principal
├── components/                   # Componentes React
│   ├── layout/                   # Componentes de layout
│   │   ├── navbar.tsx
│   │   ├── page-layout.tsx
│   │   └── providers.tsx
│   ├── ui/                       # Componentes de UI genéricos
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── confirm-modal.tsx
│   │   ├── form-input.tsx
│   │   ├── file-input.tsx
│   │   └── loading.tsx
│   ├── features/                 # Componentes de funcionalidades
│   │   ├── product-card.tsx
│   │   ├── pagination.tsx
│   │   ├── empty-state.tsx
│   │   └── stats-card.tsx
│   └── icons/                    # Ícones SVG
├── hooks/                        # Custom React Hooks
│   ├── use-color-scheme.ts
│   ├── use-confirm.ts
│   ├── use-csv-upload.ts
│   ├── use-forgot-password-form.ts
│   ├── use-login-form.ts
│   ├── use-product-form.ts
│   ├── use-product-delete.ts
│   ├── use-register-form.ts
│   ├── use-reset-password-form.ts
│   └── use-seller-products-page.ts
├── services/                     # Lógica de negócio
│   ├── account-service.ts
│   ├── auth-service.ts
│   ├── cart-service.ts
│   ├── favorites-service.ts
│   ├── orders-service.ts
│   ├── password-reset-service.ts
│   ├── products-service.ts
│   ├── register-service.ts
│   └── seller-dashboard-service.ts
├── repositories/                 # Acesso a dados (Prisma)
│   ├── cart-repository.ts
│   ├── favorites-repository.ts
│   ├── orders-repository.ts
│   ├── password-reset-repository.ts
│   ├── products-repository.ts
│   ├── seller-dashboard-repository.ts
│   └── users-repository.ts
├── schemas/                      # Schemas de validação Zod
│   ├── login-schema.ts
│   ├── register-schema.ts
│   ├── register-with-confirm-schema.ts
│   ├── forgot-password-schema.ts
│   ├── reset-password-schema.ts
│   ├── product-schema.ts
│   ├── product-update-schema.ts
│   ├── csv-product-schema.ts
│   ├── search-products-schema.ts
│   ├── add-to-cart-schema.ts
│   ├── update-cart-item-schema.ts
│   └── favorite-schema.ts
├── dtos/                         # Data Transfer Objects
│   ├── auth.dto.ts
│   ├── cart.dto.ts
│   ├── dashboard.dto.ts
│   ├── favorite.dto.ts
│   ├── order.dto.ts
│   └── product.dto.ts
├── errors/                       # Erros de domínio customizados
│   ├── domain-error.ts           # Classe base
│   ├── not-found-error.ts
│   ├── unauthorized-error.ts
│   ├── conflict-error.ts
│   ├── validation-error.ts
│   └── ...
├── config/                       # Configurações
│   ├── env.config.ts             # Variáveis de ambiente
│   └── rate-limiter.config.ts    # Configuração de rate limiting
├── lib/                          # Utilitários
│   ├── server/                   # Utilitários server-only
│   │   ├── auth.ts               # Configuração Next-Auth (server)
│   │   └── action-rate-limit.ts  # Rate limit para Server Actions
│   ├── logger.ts                 # Logger Pino
│   ├── price.ts                  # Formatação de preços
│   ├── rate-limiter.ts           # Rate limiter
│   ├── swagger.ts                # Configuração Swagger
│   ├── format-zod-error.ts       # Formatação de erros Zod
│   └── handle-service-error.ts   # Tratamento de erros de serviço
├── providers/                    # Provedores de infraestrutura
│   └── email-provider.ts         # Provedor de e-mail (Nodemailer)
├── emails/                       # Templates de e-mail
│   └── password-reset-email.tsx  # Template de recuperação de senha
├── tests/                        # Testes automatizados
│   ├── lib/
│   ├── schemas/
│   ├── services/
│   └── setup.ts
├── prisma/                       # Configuração do Prisma
│   ├── schema.prisma             # Schema do banco
│   └── seed/                     # Seeds
├── public/                       # Arquivos estáticos
├── docker-compose.yml            # PostgreSQL + Redis
├── biome.json                    # Configuração do Biome
├── package.json
└── README.md
```

## 🎨 Decisões de Arquitetura

### 1. Arquitetura em Camadas
O backend é organizado em camadas bem definidas (API → Service → Repository), garantindo separação de responsabilidades, testabilidade e facilidade de manutenção. Cada camada tem uma responsabilidade única e bem delimitada.

### 2. Custom Hooks para Lógica Client-Side
Toda a lógica client-side foi extraída para custom hooks, mantendo os componentes limpos e focados em UI:
- `use-seller-products-page.ts` — Produtos do vendedor
- `use-product-form.ts` — Formulário de produtos
- `use-csv-upload.ts` — Upload CSV
- `use-confirm.ts` — Modal de confirmação
- `use-forgot-password-form.ts` / `use-reset-password-form.ts` — Recuperação de senha

### 3. Server Actions para Cart e Favorites
Cart e Favorites utilizam **Server Actions** ao invés de client-side fetch, aproveitando a integração server-first do Next.js para essas operações frequentes.

### 4. Erros de Domínio Customizados
Uma hierarquia de erros customizados (`DomainError` como base) permite tratamento semântico de erros no backend, retornando status HTTP corretos sem lógica condicional espalhada.

### 5. Soft Delete
Usuários e produtos nunca são deletados do banco, apenas marcados como inativos:
- Preserva histórico de compras
- Permite auditoria
- Possibilita reativação

### 6. Validação em Duas Camadas
- **Frontend:** Zod schemas para feedback imediato
- **Backend:** Mesmos schemas Zod nas API Routes para segurança

### 7. Rate Limiting com Redis
Todas as rotas de API possuem rate limiting via `rate-limiter-flexible` com Redis como backend, protegendo contra abuso e ataques de força bruta.

### 8. Autenticação Stateless
Next-Auth com JWT para autenticação stateless e escalável.

## 👥 Credenciais de Teste

Após executar o seed, você pode usar:

### Vendedores
- Email: `joao@vendedor.com` / Senha: `12345678`
- Email: `maria@vendedor.com` / Senha: `12345678`

### Clientes
- Email: `carlos@cliente.com` / Senha: `12345678`
- Email: `ana@cliente.com` / Senha: `12345678`

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.
