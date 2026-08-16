import { FastifyReply, FastifyRequest } from "fastify";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
} from "../services/auth.service";
import { AuthRequest, RegisterRequest } from "../types";
import { loginSchema, registerSchema } from "../utils/validators";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validation = registerSchema.parse(request.body as RegisterRequest);

  const user = await registerUser(validation);
  const token = request.server.jwt.sign({ userId: user.id });
  reply.status(201).send({
    user,
    token,
  });
};

export const login = async (
  request: FastifyRequest<{ Body: AuthRequest }>,
  reply: FastifyReply,
) => {
  try {
    const validation = loginSchema.parse(request.body as AuthRequest);
    const user = await loginUser(validation);

    if (!user) {
      return reply.status(409).send({
        message: "As credenciais estão incorretas.",
      });
    }

    const token = request.server.jwt.sign({ userId: user.id });

    reply.setCookie("bellmont.token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return reply.status(200).send({ user, token });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return reply.status(400).send({ message: "Dados inválidos." });
    }

    console.error(error);
    return reply.status(500).send({ message: "Erro interno do servidor" });
  }
};

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send((request as any).user);
};

export const googleLogin = async (
  request: FastifyRequest<{ Body: { credential: string } }>,
  reply: FastifyReply,
) => {
  const { credential } = request.body;

  if (!credential) {
    reply.status(400).send({ message: "Credencial do Google é obrigatória " });
    return;
  }

  const user = await loginWithGoogle(credential, reply);

  if (!user) return;

  const token = request.server.jwt.sign({ userId: user.id });

  reply.setCookie("bellmont.token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  reply.status(200).send({ user });
};

export const signOut = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("bellmont.token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  reply.status(200).send({ message: "Usuário deslogado com sucesso!"})
}
