# PRD: Backend API para Ecommerce

## Objetivo

Criar um backend API que suporte o site de ecommerce existente, fornecendo gestão de produtos, categorias, usuários, pedidos, carrinho e pagamentos de forma segura e escalável.

---

## Tecnologias propostas

- Node.js + Fastify
- TypeScript
- Supabase (Postgres + Auth opcional / storage)
- Prisma
- JWT para autenticação
- Stripe para pagamento
- Vitest para testes

---

## Principais funcionalidades

### 1. Autenticação e usuários

- Cadastro de usuário (`sign-up`)
- Login com JWT (`sign-in`)
- Refresh token ou renovação de sessão
- Recuperação de senha / reset
- Perfil do usuário
- Roles / permissões básicas: `admin` e `cliente`

### 2. CRUD de produtos

- Criar produto
- Listar produtos (público, com paginação)
- Consultar produto por ID
- Atualizar produto
- Excluir produto
- Dados do produto:
  - nome, descrição, preço, estoque, status ativo/inativo
  - imagens / galeria
  - categoria(s)
  - atributos extras (SKU, dimensões, marca)

### 3. CRUD de categorias

- Criar categoria
- Listar categorias
- Consultar categoria por ID
- Atualizar categoria
- Excluir categoria
- Relacionamento produto ← categoria

### 4. CRUD de usuários

- Listar usuários (admin)
- Consultar usuário
- Atualizar usuário
- Desativar/excluir usuário
- Dados: nome, email, telefone, endereço, papel

### 5. CRUD de pedidos

- Criar pedido a partir do carrinho
- Listar pedidos do cliente
- Consultar pedido por ID
- Atualizar status do pedido (ex: `pendente`, `pago`, `enviado`, `entregue`, `cancelado`)
- Histórico de status
- Controle de itens do pedido, total, frete, descontos
- Endpoint admin para gestão de pedidos

### 6. Carrinho / sessão de compra

- Criar/atualizar carrinho
- Adicionar produto ao carrinho
- Remover produto do carrinho
- Alterar quantidade
- Calcular total
- Associar carrinho a usuário autenticado ou sessão temporária

### 7. Endpoints públicos / catálogo

- Listar produtos por categoria
- Filtro por preço, disponibilidade, categoria
- Busca por termo
- Destaques / best-sellers / novos produtos (opcional)

### 8. Pagamento com Stripe

- Criar sessão de checkout Stripe
- Validar pagamento
- Webhook Stripe para confirmação de pagamento
- Atualizar status de pedido após pagamento

### 9. Endereços e informações de entrega

- CRUD de endereços do usuário
- Endereço de entrega / cobrança no pedido
- Validação CEP / integração de frete (se necessário)

### 10. Admin / dashboard

- Endpoints protegidos para:
  - gestão de produtos
  - gestão de categorias
  - gestão de pedidos
  - gestão de usuários
- Relatórios básicos (número de pedidos, vendas por período, estoque baixo)

---

## Modelos de dados principais

- `User`:
  - id, nome, email, senha hash, role, createdAt, updatedAt
- `Product`:
  - id, nome, descrição, preço, estoque, status, imagens, categoryId
- `Category`:
  - id, nome, slug, descrição, createdAt
- `Order`:
  - id, userId, status, total, subtotal, frete, paymentStatus, createdAt
- `OrderItem`:
  - id, orderId, productId, quantidade, preçoUnitario, subtotal
- `Cart` / `CartItem`:
  - userId, productId, quantidade, preço
- `Address`:
  - userId, rua, cidade, estado, cep, país, tipo

---

## API sugerida

- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PUT /orders/:id/status`
- `POST /cart`
- `PUT /cart`
- `DELETE /cart/:productId`
- `POST /checkout`
- `POST /webhooks/stripe`

---

## Requisitos não-funcionais

- Autenticação JWT em endpoints privados
- Validação de dados com schemas TypeScript
- Logs de erros e auditoria básica
- Testes unitários e de integração com Vitest
- Segurança: proteção a SQL injection, XSS, validação de entrada
- Performance: paginação e limites de consulta
- Documentação minimalista dos endpoints (Swagger / OpenAPI opcional)

---

## Prioridade mínima para atender o site

1. Autenticação JWT
2. CRUD de produtos
3. CRUD de categorias
4. CRUD de usuários (admin)
5. Pedidos e atualização de status
6. Carrinho e checkout Stripe
7. Webhooks de pagamento
8. Testes com Vitest

---

## Observação

Esse backend deve ser pensado como API REST para suportar o front-end atual. Em um segundo momento, você pode adicionar:

- Roles mais avançadas
- Relatórios de vendas
- Catálogo com filtros avançados
- Integração de frete e estoque em tempo real
