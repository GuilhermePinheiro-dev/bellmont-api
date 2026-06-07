import { prisma } from "../lib/prisma";
import { RegisterRequest } from "../types";

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado.");
  }

  const newUser = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      cpf: payload.cpf,
      dateofBirth: payload.dateofBirth || undefined,
      phone: payload.phone,
    },
  });

  return newUser;
};
