import { FastifyInstance } from "fastify";
import {
  getCategoryByIdController,
  listCategories,
} from "../controllers/categories.controller";
import { authenticate } from "../middlewares/auth.middlewares";

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Categories"],
        description: "Lista categorias cadastradas",
        response: {
          200: {
            description: "Lista de categorias",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                slug: { type: "string" },
                active: { type: "boolean" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
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
    listCategories,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        description: "Obtém uma categoria pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Categoria encontrada",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              slug: { type: "string" },
              active: { type: "boolean" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
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
    getCategoryByIdController,
  );
}
