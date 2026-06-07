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
      birthdate: payload.birthDate ? new Date(payload.birthDate) : undefined,
      phone: payload.phone,
      role: "USER",
    },
  });

  return newUser;
};
