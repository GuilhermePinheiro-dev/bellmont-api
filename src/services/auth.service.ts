import { prisma } from "../lib/prisma";
import { RegisterRequest } from "../types";
import bcrypt from "bcrypt"

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado.");
  }

  const hasedPassword = await bcrypt.hash(payload.password, 10)

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

  return newUser;
};
