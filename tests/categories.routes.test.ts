import { beforeEach, describe, expect, it, vi } from "vitest";
import Fastify from "fastify";
import categoryRoutes from "../src/routes/categories.routes";
import {
  createNewCategory,
  deleteExistingCategory,
  getCategoryByIdController,
  listCategories,
  updateExistingCategory,
} from "../src/controllers/categories.controller";

vi.mock("../src/controllers/categories.controller", () => ({
  listCategories: vi.fn(),
  getCategoryByIdController: vi.fn(),
  createNewCategory: vi.fn(),
  updateExistingCategory: vi.fn(),
  deleteExistingCategory: vi.fn(),
}));

vi.mock("../src/middlewares/auth.middlewares", () => ({
  authenticate: async (_req: any, _reply: any) => {},
}));

vi.mock("../src/middlewares/admin.middleware", () => ({
  requireAdmin: async (_req: any, _reply: any) => {},
}));

const mockedListCategories = vi.mocked(listCategories);
const mockedGetCategoryByIdController = vi.mocked(getCategoryByIdController);
const mockedCreateNewCategory = vi.mocked(createNewCategory);
const mockedUpdateExistingCategory = vi.mocked(updateExistingCategory);
const mockedDeleteExistingCategory = vi.mocked(deleteExistingCategory);

const buildApp = () => {
  const app = Fastify();
  app.register(categoryRoutes, { prefix: "/categories" });
  return app;
};

describe("categories routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists categories", async () => {
    mockedListCategories.mockImplementation(async (_req, reply) => {
      return reply.status(200).send([{ id: 1, name: "Roupas" }]);
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/categories" });

    expect(response.statusCode).toBe(200);
    expect(mockedListCategories).toHaveBeenCalled();
    expect(response.json()).toEqual([{ id: 1, name: "Roupas" }]);
  });

  it("gets a category by id", async () => {
    mockedGetCategoryByIdController.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 2, name: "Acessórios" });
    });

    const app = buildApp();
    const response = await app.inject({ method: "GET", url: "/categories/2" });

    expect(response.statusCode).toBe(200);
    expect(mockedGetCategoryByIdController).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 2, name: "Acessórios" });
  });

  it("creates a category", async () => {
    mockedCreateNewCategory.mockImplementation(async (_req, reply) => {
      return reply.status(201).send({ id: 3, name: "Calçados" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "POST",
      url: "/categories",
      payload: { name: "Calçados" },
    });

    expect(response.statusCode).toBe(201);
    expect(mockedCreateNewCategory).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 3, name: "Calçados" });
  });

  it("updates a category", async () => {
    mockedUpdateExistingCategory.mockImplementation(async (_req, reply) => {
      return reply.status(200).send({ id: 4, name: "Esporte" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "PUT",
      url: "/categories/4",
      payload: { name: "Esporte" },
    });

    expect(response.statusCode).toBe(200);
    expect(mockedUpdateExistingCategory).toHaveBeenCalled();
    expect(response.json()).toEqual({ id: 4, name: "Esporte" });
  });

  it("deletes a category", async () => {
    mockedDeleteExistingCategory.mockImplementation(async (_req, reply) => {
      return reply
        .status(200)
        .send({ message: "Categoria removida com sucesso" });
    });

    const app = buildApp();
    const response = await app.inject({
      method: "DELETE",
      url: "/categories/5",
    });

    expect(response.statusCode).toBe(200);
    expect(mockedDeleteExistingCategory).toHaveBeenCalled();
    expect(response.json()).toEqual({
      message: "Categoria removida com sucesso",
    });
  });
});
