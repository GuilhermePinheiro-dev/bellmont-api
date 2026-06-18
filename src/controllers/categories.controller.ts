import { FastifyReply, FastifyRequest } from "fastify";
import { getCategory, getCategoryById } from "../services/categories.service";
import { categoryIdSchema } from "../utils/validators";

export const listCategories = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const categories = await getCategory();

  return reply.status(200).send(categories);
};

export const getCategoryByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const validate = categoryIdSchema.parse({
    id: Number(request.params.id),
  });

  const category = await getCategoryById(validate.id);

  return reply.status(200).send(category);
};
