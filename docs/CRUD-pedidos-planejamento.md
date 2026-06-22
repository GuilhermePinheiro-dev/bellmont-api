# CRUD de Pedidos Integrado a Produtos

## Resumo

Criar um CRUD inicial de pedidos seguindo o fluxo do projeto: `routes -> controllers -> services`, com validação Zod no controller, documentação OpenAPI nas rotas e regras de negócio no service.

O pedido será criado diretamente com `items` no body. Ao criar o pedido, o estoque dos produtos será baixado em transação. Ao cancelar um pedido, o estoque será devolvido. Não haverá remoção física de pedidos.

## Mudanças principais

- Atualizar `prisma/schema.prisma` com:
  - `Order`
  - `OrderItem`
  - enum `OrderStatus`: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELED`
  - enum `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`
  - relações entre `User`, `Order`, `OrderItem` e `Product`
- Campos planejados para `Order`:
  - `id`
  - `userId`
  - `status`
  - `paymentStatus`
  - `subtotal`
  - `shipping`
  - `discount`
  - `total`
  - `createdAt`
  - `updatedAt`
- Campos planejados para `OrderItem`:
  - `id`
  - `orderId`
  - `productId`
  - `quantity`
  - `unitPrice`
  - `subtotal`
  - `createdAt`
- Criar tipos em `src/types/index.ts`:
  - `CreateOrder`
  - `CreateOrderItem`
  - `UpdateOrderStatus`
  - `OrderFilters`
- Criar validadores em `src/utils/validators.ts`:
  - `createOrderSchema`
  - `orderIdSchema`
  - `updateOrderStatusSchema`
  - `orderFiltersSchema`

## Comportamento planejado

### `POST /orders`

- Protegido por JWT.
- Usa `request.user.userId` como dono do pedido.
- Recebe `items: [{ productId, quantity }]`, `shipping?` e `discount?`.
- Busca produtos ativos.
- Bloqueia produto inexistente, inativo ou sem estoque suficiente.
- Usa o preço atual do produto como `unitPrice`.
- Calcula `subtotal`, `discount`, `shipping` e `total`.
- Cria pedido e itens dentro de `prisma.$transaction`.
- Decrementa `Product.stock`.

### `GET /orders`

- Protegido por JWT.
- Lista pedidos do usuário autenticado.
- Aceita filtros opcionais: `status`, `paymentStatus`, `page`, `limit`.
- Inclui itens e dados básicos do produto.

### `GET /orders/:id`

- Protegido por JWT.
- Busca pedido pelo ID.
- Retorna erro se não existir.
- Por padrão, usuário comum só acessa o próprio pedido.

### `PUT /orders/:id/status`

- Protegido por JWT.
- Atualiza somente `status`.
- Se mudar para `CANCELED`, devolve estoque dos itens.
- Não permite cancelar duas vezes.
- Não devolve estoque para outros status.

### `DELETE /orders/:id`

- Não fará hard delete.
- Deve agir como cancelamento lógico, reaproveitando a mesma regra de `CANCELED`.

## Arquivos planejados

- Atualizar:
  - `prisma/schema.prisma`
  - `src/types/index.ts`
  - `src/utils/validators.ts`
  - `src/app.ts`
- Criar:
  - `src/services/orders.service.ts`
  - `src/controllers/orders.controller.ts`
  - `src/routes/orders.routes.ts`
- Após implementar schema:
  - Rodar `npm run prisma:migrate`
  - Rodar `npm run prisma:generate`
  - Verificar se o seed precisa limpar pedidos antes de produtos e categorias para evitar erro de FK.

## Testes e validação

- Rodar `npm run build`.
- Testar manualmente:
  - Criar pedido com produto ativo e estoque suficiente.
  - Criar pedido com estoque insuficiente.
  - Criar pedido com produto inativo.
  - Listar pedidos autenticado.
  - Consultar pedido por ID.
  - Atualizar status para `PAID`.
  - Cancelar pedido e confirmar devolução de estoque.
  - Tentar cancelar pedido já cancelado.
  - Validar Swagger/Scalar para `/orders`.

## Premissas

- O CRUD inicial usará itens enviados no body, não carrinho.
- Estoque será reservado ao criar pedido e devolvido ao cancelar.
- Pedido não será deletado fisicamente.
- Não haverá integração com pagamento, frete real, endereço ou Stripe nesta etapa.
- Não será criada regra avançada de admin agora; os endpoints ficam protegidos por JWT e focados no usuário autenticado.
