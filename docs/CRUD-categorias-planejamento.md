# CRUD de Categorias - Planejamento

Este arquivo descreve apenas o plano de execução do CRUD de categorias e da vinculação com produtos. Não contém implementação.

## Objetivo

Criar o CRUD de categorias seguindo o padrão do CRUD de produtos, respeitando a arquitetura atual do projeto e o PRD-backend.md.

Regras principais do escopo:

- Os campos da nova entidade não devem ser opcionais nesta fase inicial.
- Todas as rotas devem exigir autenticação via token, igual ao restante do projeto.
- O soft delete de categoria deve desativar também os produtos vinculados a ela.
- O filtro de produtos deve passar a usar categoryId.

## Etapa 1 - Schema Prisma, migration e banco

Objetivo da etapa:

- Criar a entidade Category no Prisma.
- Vincular Product a Category por categoryId.
- Atualizar o banco com as tabelas e campos novos.

Entregas esperadas:

- Definir Category no schema Prisma com campos obrigatórios.
- Adicionar relacionamento entre Product e Category.
- Incluir categoryId em Product como vínculo principal.
- Manter active como base para desativação lógica.
- Criar a migration correspondente.
- Aplicar a migration no banco.

Pontos de atenção:

- A seed atual não precisa ser refeita nesta etapa, mas o banco deve ficar pronto para uma nova seed depois.
- O schema deve seguir o padrão já usado em Product e User.

## Etapa 2 - Service

Objetivo da etapa:

- Criar a camada de regras de negócio para categorias.
- Definir como o soft delete vai se comportar.

Entregas esperadas:

- Criar service para listar, buscar, criar, atualizar e desativar categorias.
- Validar unicidade de slug antes de criar ou atualizar.
- Respeitar o fluxo de negócio do projeto com mensagens em português.
- Implementar a desativação lógica com active false.
- Ao desativar uma categoria, desativar também os produtos vinculados a ela.

Pontos de atenção:

- O service não deve validar request diretamente, apenas receber dados já validados pelo controller.
- A regra de cascata para produtos precisa ficar centralizada aqui.

## Etapa 3 - Controller

Objetivo da etapa:

- Criar os controllers de categoria no mesmo padrão do projeto.
- Garantir validação via Zod antes de chamar o service.

Entregas esperadas:

- Criar controller para listagem, detalhe, criação, atualização e exclusão lógica.
- Validar body, params e query com Zod.
- Gerar slug automaticamente com slugify quando houver nome da categoria.
- Padronizar respostas e erros em português.

Pontos de atenção:

- O controller deve preparar os dados antes de chamar o service.
- A validação deve ficar no controller, como já foi definido nas instruções do projeto.

## Etapa 4 - Rotas e ajuste em products

Objetivo da etapa:

- Criar as rotas de categorias.
- Ajustar o filtro de produtos para categoryId.

Entregas esperadas:

- Criar rotas com autenticação obrigatória em todas as ações.
- Adicionar schema OpenAPI inline nas rotas de categoria.
- Garantir que a documentação siga o padrão de products.
- Atualizar productFiltersSchema para aceitar categoryId.
- Ajustar getProducts em products.service.ts para usar categoryId no where do Prisma.

Pontos de atenção:

- O filtro antigo baseado em texto de categoria deve deixar de ser o caminho principal.
- As rotas devem seguir o mesmo padrão visual e estrutural do CRUD de produtos.

## Ordem de execução recomendada

1. Schema Prisma e migration.
2. Service de categorias.
3. Controller de categorias.
4. Rotas de categorias e ajuste do filtro de products.

## Dependências do próximo passo

- Nova seed com categorias e produtos vinculados.
- Revisão da documentação OpenAPI depois que as rotas existirem.
- Validação do comportamento de soft delete em categorias e produtos.

## Critérios de aceite

- Category existe no Prisma e Product possui categoryId.
- Categorias podem ser criadas, listadas, atualizadas e desativadas logicamente.
- Desativar uma categoria desativa os produtos vinculados.
- Todas as rotas de categoria exigem token.
- O filtro de produtos usa categoryId.
- O fluxo mantém a arquitetura routes -> controllers -> services.
