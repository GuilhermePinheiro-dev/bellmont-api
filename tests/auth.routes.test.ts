import { beforeEach, describe, expect, it, vi } from "vitest";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import authRoutes from "../src/routes/auth.routes";
import { loginUser, registerUser } from "../src/services/auth.service";

vi.mock("../src/services/auth.service", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

const mockedRegisterUser = vi.mocked(registerUser);
const mockedLoginUser = vi.mocked(loginUser);

describe("auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user and returns a token", async () => {
    mockedRegisterUser.mockResolvedValue({
      id: "user-1",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "USER",
    } as any);

    const app = Fastify();
    app.register(fastifyCookie);
    app.register(jwt, { secret: "test-secret" });
    app.register(authRoutes, { prefix: "/auth" });

    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(mockedRegisterUser).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Ada",
        email: "ada@example.com",
      }),
    );

    const body = response.json();
    expect(body).toHaveProperty("token");
    expect(body.user.email).toBe("ada@example.com");
  });

  it("logs in a user and returns a token", async () => {
    mockedLoginUser.mockResolvedValue({
      id: "user-1",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      role: "USER",
    } as any);

    const app = Fastify();
    app.register(fastifyCookie);
    app.register(jwt, { secret: "test-secret" });
    app.register(authRoutes, { prefix: "/auth" });

    const response = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "ada@example.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "123456",
    });

    const body = response.json();
    expect(body).toHaveProperty("token");
    expect(body.user.email).toBe("ada@example.com");
  });

  it("returns 409 when the credentials are invalid", async () => {
    mockedLoginUser.mockResolvedValue(null);

    const app = Fastify();
    app.register(fastifyCookie);
    app.register(jwt, { secret: "test-secret" });
    app.register(authRoutes, { prefix: "/auth" });

    const response = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "ada@example.com",
        password: "wrong-password",
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "As credenciais estão incorretas.",
    });
  });
});
