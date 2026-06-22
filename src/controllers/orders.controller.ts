import { FastifyReply, FastifyRequest } from "fastify";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../services/orders.service";
import {
  createOrderSchema,
  orderFiltersSchema,
  orderIdSchema,
  updateOrderStatusSchema,
} from "../utils/validators";
import { CreateOrder, OrderFilters, UpdateOrderStatus } from "../types";

type JwtPayload = {
  userId?: number;
};

const getAuthenticatedUserId = (request: FastifyRequest) => {
  const user = request.user as JwtPayload;

  if (!user?.userId) {
    throw new Error("Usuario nao autenticado");
  }

  return user.userId;
};

const sendOrderError = (error: unknown, reply: FastifyReply) => {
  const message =
    error instanceof Error ? error.message : "Erro ao processar pedido";

  if (message.includes("nÃ£o encontrado") || message.includes("nao encontrado")) {
    return reply.status(404).send({ message });
  }

  return reply.status(400).send({ message });
};

export const listOrders = async (
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply,
) => {
  const userId = getAuthenticatedUserId(request);
  const filters = orderFiltersSchema.parse(request.query) as OrderFilters;
  const orders = await getOrders(userId, filters);

  return reply.status(200).send(orders);
};

export const getOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const userId = getAuthenticatedUserId(request);
  const validate = orderIdSchema.parse({
    id: Number(request.params.id),
  });

  try {
    const order = await getOrderById(userId, validate.id);
    return reply.status(200).send(order);
  } catch (error) {
    return sendOrderError(error, reply);
  }
};

export const createNewOrder = async (
  request: FastifyRequest<{ Body: CreateOrder }>,
  reply: FastifyReply,
) => {
  const userId = getAuthenticatedUserId(request);
  const validate = createOrderSchema.parse(request.body);

  try {
    const order = await createOrder({
      ...validate,
      userId,
    });

    return reply.status(201).send(order);
  } catch (error) {
    return sendOrderError(error, reply);
  }
};

export const updateExistingOrderStatus = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateOrderStatus;
  }>,
  reply: FastifyReply,
) => {
  const userId = getAuthenticatedUserId(request);
  const params = orderIdSchema.parse({
    id: Number(request.params.id),
  });
  const body = updateOrderStatusSchema.parse(request.body);

  try {
    const order = await updateOrderStatus(userId, params.id, body.status);
    return reply.status(200).send(order);
  } catch (error) {
    return sendOrderError(error, reply);
  }
};

export const deleteExistingOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const userId = getAuthenticatedUserId(request);
  const validate = orderIdSchema.parse({
    id: Number(request.params.id),
  });

  try {
    await cancelOrder(userId, validate.id);
    return reply.status(200).send({ message: "Pedido cancelado com sucesso" });
  } catch (error) {
    return sendOrderError(error, reply);
  }
};
