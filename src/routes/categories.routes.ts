import { FastifyInstance } from "fastify";
import {
  createNewCategory,
  deleteExistingCategory,
  getCategoryByIdController,
  listCategories,
  updateExistingCategory,
} from "../controllers/categories.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { requireAdmin } from "../middlewares/admin.middleware";
import { CreateCategory, UpdateCategory } from "../types";

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Categories"],
        description: "Lista categorias cadastradas",
        security: [{ bearerAuth: [] }],
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

  fastify.post<{ Body: CreateCategory }>(
    "/",
    {
      onRequest: [requireAdmin],
      schema: {
        tags: ["Categories"],
        description: "Cria uma nova categoria",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            active: { type: "boolean" },
          },
        },
        response: {
          201: {
            description: "Categoria criada com sucesso",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              slug: { type: "string" },
              active: { type: "boolean" },
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
    createNewCategory,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        description: "Obtém uma categoria pelo ID",
        security: [{ bearerAuth: [] }],
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

  fastify.put<{ Body: Partial<UpdateCategory>; Params: { id: string } }>(
    "/:id",
    {
      onRequest: [requireAdmin],
      schema: {
        tags: ["Categories"],
        description: "Atualiza uma categoria existente",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            active: { type: "boolean" },
          },
        },
        response: {
          200: {
            description: "Categoria atualizada com sucesso",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              slug: { type: "string" },
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
    updateExistingCategory,
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      onRequest: [requireAdmin],
      schema: {
        tags: ["Categories"],
        description: "Desativa uma categoria existente",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Categoria removida com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
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
    deleteExistingCategory,
  );
}
