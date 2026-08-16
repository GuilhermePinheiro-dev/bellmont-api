import { FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { AuthRequest, RegisterRequest } from "../types";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado.");
  }

  const hasedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hasedPassword,
      cpf: payload.cpf,
      birthdate: payload.birthDate ? new Date(payload.birthDate) : undefined,
      phone: payload.phone,
      role: "USER",
    },
  });

  const { password, ...newUserWithoutPassord } = newUser;

  return newUserWithoutPassord;
};

export const loginUser = async (data: AuthRequest) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) return null;

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (credential: string, reply: FastifyReply) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    reply.status(401).send({ message: "Token inválido" });
    return;
  }

  const { email, given_name, family_name } = payload;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: given_name || "",
        lastName: family_name || "",
        email,
        password: "",
        role: "USER",
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
