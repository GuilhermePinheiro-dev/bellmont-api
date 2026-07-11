import { beforeEach, describe, expect, it, vi } from "vitest";
import Fastify from "fastify";
import orderRoutes from "../src/routes/orders.routes";
import {
  createNewOrder,
  deleteExistingOrder,
  getOrder,
  listOrders,
  updateExistingOrderStatus,
} from "../src/controllers/orders.controller";

vi.mock("../src/controllers/orders.controller", () => ({
  listOrders: vi.fn(),
  getOrder: vi.fn(),
  createNewOrder: vi.fn(),
  updateExistingOrderStatus: vi.fn(),
  deleteExistingOrder: vi.fn(),
}));

vi.mock("../src/middlewares/auth.middlewares", () => ({
  authenticate: async (_req: any, _reply: any) => {},
}));

const mockedListOrders = vi.mocked(listOrders);
const mockedGetOrder = vi.mocked(getOrder);
const mockedCreateNewOrder = vi.mocked(createNewOrder);
const mockedUpdateExistingOrderStatus = vi.mocked(updateExistingOrderStatus);
const mockedDeleteExistingOrder = vi.mocked(deleteExistingOrder);

const buildApp = () => {
  const app = Fastify();
  app.register(orderRoutes, { prefix: "/orders" });
  return app;
};

describe("orders routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists orders", async () => {
    mockedListOrders.mockImplementation(async (_req, reply) => {
      return reply.status(200).send([{ id: 1, status: "PENDING" }]);
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/orders" });

    expect(response.statusCode).toBe(200);
    expect(mockedListOrders).toHaveBeenCalled();
    expect(response.json()).toEqual([{ id: 1, status: "PENDING" }]);
  });

  it("gets an order by id", async () => {
    mockedGetOrder.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 2, status: "PAID" });
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/orders/2" });

    expect(response.statusCode).toBe(200);
    expect(mockedGetOrder).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 2, status: "PAID" });
  });

  it("creates an order", async () => {
    mockedCreateNewOrder.mockImplementation(async (_req, reply) => {
      return reply.status(201).send({ id: 3, status: "PENDING" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/orders",
      payload: {
        items: [{ productId: 1, quantity: 2 }],
        shippingAddress: {
          cep: "01000-000",
          street: "Rua das Flores",
          number: "100",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(mockedCreateNewOrder).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 3, status: "PENDING" });
  });

  it("updates an order status", async () => {
    mockedUpdateExistingOrderStatus.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 4, status: "SHIPPED" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "PUT",
      url: "/orders/4/status",
      payload: { status: "SHIPPED" },
    });

    expect(response.statusCode).toBe(200);
    expect(mockedUpdateExistingOrderStatus).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 4, status: "SHIPPED" });
  });

  it("deletes an order", async () => {
    mockedDeleteExistingOrder.mockImplementation(async (_req, reply) => {
      return reply
        .status(200)
        .send({ message: "Pedido cancelado com sucesso" });
    });

    const app = buildApp();
    const response = await app.inject({ method: "DELETE", url: "/orders/5" });

    expect(response.statusCode).toBe(200);
    expect(mockedDeleteExistingOrder).toHaveBeenCalled();
    expect(response.json()).toEqual({
      message: "Pedido cancelado com sucesso",
    });
  });
});
