import { FastifyInstance } from "fastify";
import { listProducts } from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middlewares";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Lista produtos com filtros opcionais",
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1 },
            category: { type: "string" },
            priceMin: { type: "number", minimum: 0 },
            priceMax: { type: "number", minimum: 0 },
            search: { type: "string" },
            sortBy: { type: "string", enum: ["price", "name", "createdAt"] },
            sortOrder: { type: "string", enum: ["asc", "desc"] },
          },
        },
      },
    },
    listProducts,
  );
}
