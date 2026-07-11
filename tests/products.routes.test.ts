import { beforeEach, describe, expect, it, vi } from "vitest";
import Fastify from "fastify";
import productRoutes from "../src/routes/products.routes";
import {
  createNewProduct,
  deleteExistingProduct,
  getProduct,
  listProducts,
  updateExistingProduct,
} from "../src/controllers/products.controller";

vi.mock("../src/controllers/products.controller", () => ({
  listProducts: vi.fn(),
  getProduct: vi.fn(),
  createNewProduct: vi.fn(),
  updateExistingProduct: vi.fn(),
  deleteExistingProduct: vi.fn(),
}));

vi.mock("../src/middlewares/auth.middlewares", () => ({
  authenticate: async (_req: any, _reply: any) => {},
}));

vi.mock("../src/middlewares/admin.middleware", () => ({
  requireAdmin: async (_req: any, _reply: any) => {},
}));

const mockedListProducts = vi.mocked(listProducts);
const mockedGetProduct = vi.mocked(getProduct);
const mockedCreateNewProduct = vi.mocked(createNewProduct);
const mockedUpdateExistingProduct = vi.mocked(updateExistingProduct);
const mockedDeleteExistingProduct = vi.mocked(deleteExistingProduct);

const buildApp = () => {
  const app = Fastify();
  app.register(productRoutes, { prefix: "/products" });
  return app;
};

describe("products routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists products", async () => {
    mockedListProducts.mockImplementation(async (_req, reply) => {
      return reply.status(200).send([{ id: 1, name: "Camiseta" }]);
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/products" });

    expect(response.statusCode).toBe(200);
    expect(mockedListProducts).toHaveBeenCalled();
    expect(response.json()).toEqual([{ id: 1, name: "Camiseta" }]);
  });

  it("gets a product by id", async () => {
    mockedGetProduct.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 7, name: "Tênis" });
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/products/7" });

    expect(response.statusCode).toBe(200);
    expect(mockedGetProduct).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 7, name: "Tênis" });
  });

  it("creates a product", async () => {
    mockedCreateNewProduct.mockImplementation(async (_req, reply) => {
      return reply
        .status(201)
        .send({ message: "Produto criado com sucesso!!" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/products",
      payload: {
        name: "Jaqueta",
        description: "Jaqueta de inverno",
        price: 199.9,
        stock: 10,
        active: true,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(mockedCreateNewProduct).toHaveBeenCalled();
    expect(response.json()).toEqual({
      message: "Produto criado com sucesso!!",
    });
  });

  it("updates a product", async () => {
    mockedUpdateExistingProduct.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 2, name: "Camiseta Atualizada" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "PUT",
      url: "/products/2",
      payload: {
        name: "Camiseta Atualizada",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(mockedUpdateExistingProduct).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 2, name: "Camiseta Atualizada" });
  });

  it("deletes a product", async () => {
    mockedDeleteExistingProduct.mockImplementation(async (_req, reply) => {
      return reply
        .status(200)
        .send({ message: "Produto removido com sucesso" });
    });

    const app = buildApp();
    const response = await app.inject({ method: "DELETE", url: "/products/3" });

    expect(response.statusCode).toBe(200);
    expect(mockedDeleteExistingProduct).toHaveBeenCalled();
    expect(response.json()).toEqual({
      message: "Produto removido com sucesso",
    });
  });
});
