import { FastifyInstance } from "fastify";
import {
  createNewProduct,
  getProduct,
  listProducts,
} from "../controllers/products.controller";
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
        response: {
          200: {
            description: "Lista de produtos",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                stock: { type: "number" },
                images: {
                  type: "array",
                  items: { type: "string" },
                },
                sizes: {
                  type: "array",
                  items: { type: "string" },
                },
                active: { type: "boolean" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: { message: { type: "string" } },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    listProducts,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Obter um produto pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Produto encontrado",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              slug: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              stock: { type: "number" },
              images: {
                type: "array",
                items: { type: "string" },
              },
              sizes: {
                type: "array",
                items: { type: "string" },
              },
              active: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          400: {
            description: "Requisição inválida",
            type: "object",
            properties: { message: { type: "string" } },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    getProduct,
  );
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Criar um novo produto",
        required: ["name", "description", "price", "slug", "active", "stock"],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "number" },
            active: { type: "boolean" },
            colors: { type: "array", items: { type: "string" } },
            images: {
              type: "array",
              items: { type: "string" },
            },
            sizes: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
    createNewProduct,
  );
}
