import { FastifyInstance } from "fastify";
import {
  createNewOrder,
  deleteExistingOrder,
  getOrder,
  listOrders,
  updateExistingOrderStatus,
} from "../controllers/orders.controller";
import { authenticate } from "../middlewares/auth.middlewares";

const orderResponse = {
  type: "object",
  properties: {
    id: { type: "number" },
    userId: { type: "number" },
    status: { type: "string" },
    paymentStatus: { type: "string" },
    subtotal: { type: "number" },
    shipping: { type: "number" },
    discount: { type: "number" },
    total: { type: "number" },
    shippingAddress: {
      type: "object",
      properties: {
        cep: { type: "string" },
        street: { type: "string" },
        number: { type: "string" },
        complement: { type: "string" },
        neighborhood: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
      },
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          orderId: { type: "number" },
          productId: { type: "number" },
          quantity: { type: "number" },
          unitPrice: { type: "number" },
          subtotal: { type: "number" },
          product: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              slug: { type: "string" },
              price: { type: "number" },
              images: {},
              active: { type: "boolean" },
            },
          },
        },
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const errorResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const shippingAddressSchema = {
  type: "object",
  required: ["cep", "street", "number", "neighborhood", "city", "state"],
  properties: {
    cep: { type: "string", description: "CEP com 8 dígitos" },
    street: { type: "string", description: "Rua/Avenida" },
    number: { type: "string", description: "Número" },
    complement: { type: "string", description: "Complemento (opcional)" },
    neighborhood: { type: "string", description: "Bairro" },
    city: { type: "string", description: "Cidade" },
    state: { type: "string", description: "Estado (UF)" },
    country: {
      type: "string",
      default: "BR",
      description: "País (padrão: BR)",
    },
  },
};

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Orders"],
        description: "Lista pedidos do usuario autenticado",
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1 },
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"],
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            },
            totalMin: { type: "number", minimum: 0 },
            totalMax: { type: "number", minimum: 0 },
            sortBy: { type: "string", enum: ["total", "createdAt", "status"] },
            sortOrder: { type: "string", enum: ["asc", "desc"] },
          },
        },
        response: {
          200: {
            description: "Lista de pedidos",
            type: "array",
            items: orderResponse,
          },
          400: errorResponse,
          401: errorResponse,
        },
      },
    },
    listOrders,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        description: "Obtem um pedido pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: orderResponse,
          400: errorResponse,
          401: errorResponse,
          404: errorResponse,
        },
      },
    },
    getOrder,
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Orders"],
        description: "Cria um novo pedido e atualiza o estoque dos produtos",
        body: {
          type: "object",
          required: ["items", "shippingAddress"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "number", minimum: 1 },
                  quantity: { type: "number", minimum: 1 },
                },
              },
            },
            shippingAddress: shippingAddressSchema,
            shipping: { type: "number", minimum: 0 },
            discount: { type: "number", minimum: 0 },
          },
        },
        response: {
          201: orderResponse,
          400: errorResponse,
          401: errorResponse,
        },
      },
    },
    createNewOrder,
  );

  fastify.put(
    "/:id/status",
    {
      schema: {
        tags: ["Orders"],
        description: "Atualiza o status de um pedido",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"],
            },
          },
        },
        response: {
          200: orderResponse,
          400: errorResponse,
          401: errorResponse,
          404: errorResponse,
        },
      },
    },
    updateExistingOrderStatus,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        description: "Cancela um pedido existente sem remover o historico",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          400: errorResponse,
          401: errorResponse,
          404: errorResponse,
        },
      },
    },
    deleteExistingOrder,
  );
}
