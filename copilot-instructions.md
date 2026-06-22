# Copilot Instructions for Bellmont API

Use these instructions when contributing to this repository. Follow them as hard rules unless a task explicitly asks for a different approach.

## Project Context

- This is a TypeScript API built with Fastify, Prisma, PostgreSQL, JWT, Zod, bcrypt, Swagger/OpenAPI and Scalar.
- The codebase is an ecommerce backend. Keep solutions aligned with REST APIs, authentication, product catalog, orders, and future checkout/inventory work.
- Prefer small, focused changes that fit the existing architecture instead of introducing new patterns without need.

## Required Architecture

- Keep the 3-layer flow: routes -> controllers -> services.
- Routes must only register HTTP metadata and wire handlers.
- Controllers must handle request parsing, validation orchestration, response shaping, and mapping of domain errors to HTTP responses.
- Services must contain the business rules and database access through Prisma.
- Do not move business logic into routes.
- Do not let services depend on Fastify request or reply objects.

### Expected request flow

1. Route declares schema, tags, description, auth, and handler.
2. Controller validates input with Zod.
3. Controller normalizes request data when needed, such as slug generation.
4. Controller calls service with already validated data.
5. Service reads or writes through Prisma and enforces domain rules.
6. Controller returns the HTTP response.

### Example flow

- `POST /products`
- Route exposes OpenAPI schema and protected access.
- Controller validates body with Zod, generates `slug` automatically from `name`, and calls the service.
- Service checks slug uniqueness, creates the product, and returns the created record.
- Controller returns `201` with a success message or entity payload.

## Mandatory Patterns

- Validate request data in controllers using Zod schemas from `src/utils/validators.ts` or a nearby domain-specific validator.
- Keep request validation close to the controller boundary, not in the route.
- Generate slugs automatically with `slugify` when a name is used to identify a product, category, or similar resource.
- Use soft delete semantics when the domain supports it. For products and categories, prefer `active: false` over physical deletion unless a hard delete is explicitly required.
- When a category is deactivated, keep linked products consistent by deactivating them through `categoryId`.
- Preserve Portuguese user-facing messages and error text.
- Preserve the current naming style used in the repo, even when it is mixed English/Portuguese, unless a task explicitly asks for a cleanup.
- Prefer explicit checks and readable guards over clever abstractions.

## Authentication

- Authentication is based on Fastify JWT.
- JWT is registered in `src/app.ts` with a shared secret from environment variables.
- Protected routes must require the auth middleware hook or equivalent request guard.
- The auth middleware must call `request.jwtVerify()` and return `401` for invalid or missing tokens.
- On successful login or registration, sign a token with the user identifier payload.
- Keep token payloads minimal.
- Never expose password hashes in API responses.

### Auth flow

- Register: validate payload, hash password with bcrypt, create user, sign token, return user and token.
- Login: validate payload, verify credentials, sign token, return user and token.
- Any private route should document the bearer token requirement in OpenAPI.

## Prisma Schema Rules

- The current Prisma schema is intentionally small and should be treated as the source of truth.
- `User` currently includes `firstName`, `lastName`, `email`, `password`, `cpf`, `phone`, `birthdate`, `createdAt`, `updatedAt`, and `role`.
- `Product` currently includes `name`, `slug`, `description`, `price`, `stock`, `colors`, `images`, `sizes`, `active`, `createdAt`, and `updatedAt`.
- `Category` currently includes `name`, `slug`, `active`, `products`, `createdAt`, and `updatedAt`.
- `Role` is an enum with `USER` and `ADMIN`.
- `colors`, `images`, and `sizes` are Json fields and must be treated as array-like structured data in the application layer.
- `slug` is unique and must be checked before create or update.
- `active` controls logical availability and should be used for deactivation flows.
- Product filtering should use `categoryId` instead of text-based category matching.
- If a schema change is needed, update Prisma schema, migration, seed logic, generated client expectations, and any affected validators together.

## Validation and Data Handling

- Use Zod for validation at the edge of the application.
- For query parameters, accept string input from Fastify and preprocess or coerce values before validation.
- Do not trust request params, querystring, or body objects directly.
- Normalize identifiers like `id` with number parsing before reaching the service layer.
- Keep validator messages actionable and consistent with the rest of the project.

## OpenAPI / Swagger / Scalar

- Every route should declare inline OpenAPI schema metadata when practical.
- Include `tags`, `description`, request schemas, and response schemas in route definitions.
- Keep route schemas aligned with controller validation so documentation and runtime behavior do not drift.
- The project uses Swagger/OpenAPI plus Scalar UI. Preserve both when adding or editing routes.
- For protected endpoints, document bearer auth where appropriate.

## Prisma and Development Commands

- `npm run dev` starts the API in watch mode through `tsx`.
- `npm run build` compiles TypeScript.
- `npm start` runs the built server from `dist`.
- `npm run prisma:generate` regenerates the Prisma client.
- `npm run prisma:migrate` creates and applies a migration in development.
- `npm run prisma:studio` opens Prisma Studio.
- `npm run prisma:seed` runs the seed script.

### When changing schema

1. Update `prisma/schema.prisma`.
2. Run migration and generate client.
3. Update validators, services, and routes that depend on the changed model.
4. Check seeds and any generated Prisma imports.

## Planned Integrations from the PRD

- Treat the PRD as the product roadmap for future work.
- Planned integrations include Supabase Storage for image files, ViaCEP for address lookup, and payment flows for checkout.
- Future work must keep the current architecture stable so these integrations can be added without major rewrites.
- Prefer abstractions that can later plug into storage, shipping, and payment providers.

## Common Project-Specific Problems and Fixes

- If a product slug collides, stop in the service layer and return a clear error before writing to the database.
- If a category slug collides, stop in the service layer and return a clear error before writing to the database.
- If a route accepts strings for numeric fields, coerce them before validation or before service logic.
- If JWT requests fail, check that the middleware is registered and that `JWT_SECRET` exists in the environment.
- If Swagger and the controller disagree, fix the route schema first and then align validation.
- If Prisma types appear stale, regenerate the client before changing application code further.
- If product data should be hidden, prefer filtering by `active` rather than deleting records outright.
- If products need to be grouped or filtered by category, use `categoryId` directly.
- If a change spans auth, routes, and Prisma, update all three layers in one pass to avoid half-finished behavior.

## Implementation Preferences

- Keep files focused and consistent with the surrounding style.
- Avoid introducing new libraries unless they clearly improve the current stack.
- Prefer straightforward TypeScript over unnecessary abstraction.
- Preserve the current API behavior unless the task explicitly asks for a breaking change.
- When the task is ambiguous, choose the smallest change that keeps the architecture coherent.

## Guidance for Future Agents

- Read the nearest route, controller, service, validator, and Prisma model before editing.
- Make the smallest edit that satisfies the request.
- Validate after editing with the narrowest useful check available.
- If you need to change a pattern, check whether the same pattern is repeated elsewhere in the repo before editing only one file.
