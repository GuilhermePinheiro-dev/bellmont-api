import { FastifyReply, FastifyRequest } from "fastify";
import slugify from "slugify";
import {
  deleteCategory,
  getCategory,
  getCategoryById,
  saveCategory,
  updateCategory,
} from "../services/categories.service";
import {
  categoryIdSchema,
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../utils/validators";
import { CreateCategory, UpdateCategory } from "../types";

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

export const createNewCategory = async (
  request: FastifyRequest<{ Body: CreateCategory }>,
  reply: FastifyReply,
) => {
  const body = request.body;

  body.slug = slugify(body.name, {
    lower: true,
    strict: true,
    locale: "pt",
  });

  const validate = createCategorySchema.parse(body);

  const category = await saveCategory(validate);

  return reply.status(201).send(category);
};

export const updateExistingCategory = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<UpdateCategory>;
  }>,
  reply: FastifyReply,
) => {
  const id = Number(request.params.id);
  const body = request.body;

  const validate = updateCategorySchema.parse(body);

  if (validate.name) {
    validate.slug = slugify(validate.name, {
      lower: true,
      strict: true,
      locale: "pt",
    });
  }

  const category = await updateCategory(id, validate);

  return reply.status(200).send(category);
};

export const deleteExistingCategory = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const validate = deleteCategorySchema.parse({
    id: Number(request.params.id),
  });

  await deleteCategory(validate.id);

  return reply.status(200).send({ message: "Categoria removida com sucesso" });
};
