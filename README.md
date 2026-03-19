# Cartlyn Store - Plataforma de E-commerce

Uma plataforma completa de e-commerce desenvolvida com Next.js 15, TypeScript e Prisma, permitindo que vendedores gerenciem produtos e clientes realizem compras.

## 🌐 Ambiente de Demonstração

**Acesse a aplicação em produção:** [https://desafio-fullstack-cartlyn.vercel.app](https://desafio-fullstack-cartlyn.vercel.app)

Utilize as [credenciais de teste](#credenciais-de-teste) para fazer login.

## 📋 Índice

- [Ambiente de Demonstração](#ambiente-de-demonstração)
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
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Toastify** - Notificações
- **Next-Auth** - Autenticação

### Backend
- **Next.js API Routes** - Backend separado via rotas API
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados

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
├── products/      # CRUD de produtos
├── cart/          # Gerenciamento do carrinho
├── orders/        # Pedidos
├── favorites/     # Produtos favoritos
├── account/       # Gerenciamento de conta
└── seller/        # Endpoints exclusivos para vendedores
```

#### Frontend (Client Components)
- **Localização:** `/app/*` (pages) e `/components/*`
- **Função:** Interface do usuário e experiência
- **Comunicação:** Client-side fetch para API Routes
- **Estado:** React Hooks e custom hooks

### Por que Client Fetch ao invés de Server Actions?

**Decisão Arquitetural:** Optei por utilizar `fetch` client-side ao invés de Server Actions para atender os requisitos da aplicação:

1. **Separação Clara de Responsabilidades**
   - Backend: API Routes funcionam como um backend REST tradicional
   - Frontend: Componentes client fazem requisições HTTP
   - Esta abordagem reflete melhor a arquitetura de aplicações com backend separado

2. **RESTful API Completa**
   - As API Routes podem ser consumidas por qualquer cliente (web, mobile, desktop)
   - Facilita futura migração para microserviços se necessário
   - Permite testes independentes do backend

3. **Familiaridade e Padrões**
   - Padrão REST é amplamente conhecido e documentado
   - Facilita onboarding de novos desenvolvedores
   - Integração mais simples com ferramentas de teste de API

4. **Flexibilidade**
   - Possibilidade de adicionar rate limiting, caching, etc. nas rotas
   - Logs e monitoramento centralizados
   - Versionamento de API mais simples

## ✨ Funcionalidades

### Para Clientes
- ✅ Cadastro e login
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
- ✅ Dark mode
- ✅ Design responsivo
- ✅ TypeScript em toda a aplicação

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Passos

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio-fullstack-cartlyn
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
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cartlyn_store"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

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
# Database para o docker-compose

POSTGRES_USER=cartlyn
POSTGRES_PASSWORD=cartlyn123
POSTGRES_DB=cartlyn_store
POSTGRES_PORT=5432

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}" # reutiliza as variaveis do docker-compose para criar a url que vai ser usada pelo prisma se não for usar o docker-compose apenas essa variável é suficiente para subir a aplicação.

# NextAuth
NEXTAUTH_SECRET="chave-secreta-para-jwt"
NEXTAUTH_URL="http://localhost:3000"
```

### Banco de Dados

O projeto utiliza PostgreSQL. Você pode usar o docker-compose.yml disponível na raiz do projeto:

```bash
    docker compose up -d
```

## 📁 Estrutura de Pastas

```
desafio-fullstack-cartlyn/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend - API Routes
│   │   ├── auth/                 # Autenticação
│   │   ├── products/             # CRUD Produtos
│   │   ├── cart/                 # Carrinho
│   │   ├── orders/               # Pedidos
│   │   ├── favorites/            # Favoritos
│   │   └── seller/               # Rotas do vendedor
│   ├── (auth)/                   # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── products/[id]/            # Detalhes do produto
│   ├── seller/                   # Páginas do vendedor
│   │   ├── products/
│   │   └── dashboard/
│   ├── store/                    # Loja (listagem)
│   ├── cart/                     # Página do carrinho
│   ├── orders/                   # Histórico de pedidos
│   ├── favorites/                # Produtos favoritos
│   ├── settings/                 # Configurações da conta
│   └── layout.tsx                # Layout principal
├── components/                   # Componentes React
│   ├── button.tsx
│   ├── card.tsx
│   ├── form-input.tsx
│   ├── modal.tsx
│   ├── navbar.tsx
│   ├── pagination.tsx
│   └── ...
├── hooks/                        # Custom React Hooks
│   ├── use-cart.ts
│   ├── use-favorites.ts
│   ├── use-product-form.ts
│   ├── use-store-products.ts
│   └── ...
├── lib/                          # Utilitários e configurações
│   ├── auth.ts                   # Configuração Next-Auth
│   ├── prisma.ts                 # Cliente Prisma
│   ├── validations.ts            # Schemas Zod
│   └── format-zod-error.ts
├── prisma/                       # Configuração do Prisma
│   ├── schema.prisma             # Schema do banco
│   └── seed/                     # Seeds
├── public/                       # Arquivos estáticos
├── .env                          # Variáveis de ambiente
├── package.json
└── README.md
```

## 🎨 Decisões de Arquitetura

### 1. Custom Hooks para Lógica de Negócio
Toda a lógica client-side foi extraída para custom hooks, mantendo os componentes limpos e focados em UI:
- `use-cart.ts` - Gerenciamento do carrinho
- `use-favorites.ts` - Gerenciamento de favoritos
- `use-product-form.ts` - Formulário de produtos
- `use-seller-products.ts` - Lista de produtos do vendedor

### 2. Uncontrolled Components com useRef
Formulários que só leem valores no submit utilizam `useRef` ao invés de `useState` para:
- Eliminar re-renders desnecessários
- Melhor performance
- Código mais limpo

### 3. Soft Delete
Usuários e produtos nunca são deletados do banco, apenas marcados como inativos:
- Preserva histórico de compras
- Permite auditoria
- Possibilita reativação

### 4. Validação em Duas Camadas
- **Frontend:** Zod schemas para feedback imediato
- **Backend:** Mesmos schemas Zod nas API Routes para segurança

### 5. Autenticação Stateless
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
