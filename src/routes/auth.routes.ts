import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Auth"],
        description: "Registra novo usuário e retorna um token JWT",
        body: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string", description: "Nome do usuário" },
            lastName: { type: "string", description: "Sobrenome do usuário" },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Senha do usuário",
            },
            cpf: {
              type: "string",
              description: "CPF do usuário (somente números)",
            },
            birthDate: {
              type: "string",
              format: "date",
              description: "Data de nascimento do usuário (YYYY-MM-DD)",
            },
            phone: {
              type: "string",
              description:
                "Telefone do usuário (somente números, 10 ou 11 dígitos)",
            },
          },
        },
      },
    },
    register,
  );
}
