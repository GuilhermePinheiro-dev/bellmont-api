import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    await request.jwtVerify();

    const userId = (request.user as any).userId;

    if (!userId) {
      return reply
        .status(401)
        .send({ message: "Token inválido ou ID do usuário não encontrado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return reply.status(401).send({ message: "Usuário não encontrado" });
    }

    const { password, ...userWithoutPassword } = user;

    request.user = userWithoutPassword
    
  } catch (error) {
    reply.status(401).send({ message: "Token inválido ou não autorizado" });
  }
};
