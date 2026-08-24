import { FastifyReply, FastifyRequest } from "fastify";
import {
  deleteProduct,
  getProducts,
  getProductsById,
  saveProduct,
  updateProduct,
} from "../services/products.service";
import {
  createProductSchema,
  deleteProductSchema,
  productFiltersSchema,
  updateProductSchema,
} from "../utils/validators";
import { CreateProduct, ProductFilters, UpdateProduct } from "../types";
import { generateSlug } from "../utils/slug";

const normalizeProductUpdate = (body: Partial<UpdateProduct>) =>
  Object.fromEntries(
    Object.entries(body).filter(([, value]) => {
      if (typeof value === "string") return value.trim() !== "";
      if (Array.isArray(value)) {
        return (
          value.length > 0 &&
          value.some((item) => typeof item !== "string" || item.trim() !== "")
        );
      }
      return value !== undefined;
    }),
  );

export const listProducts = async (
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply,
) => {
  const filters = productFiltersSchema.parse(request.query);
  const result = await getProducts(filters as ProductFilters);
  return reply.status(200).send(result);
};

export const getProduct = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const product = await getProductsById(Number(request.params.id));

  reply.status(200).send(product);
};

export const createNewProduct = async (
  request: FastifyRequest<{ Body: CreateProduct }>,
  reply: FastifyReply,
) => {
  const body = request.body;
  body.slug = generateSlug(body.name);

  const validate = createProductSchema.parse(body);

  await saveProduct(validate);

  reply.status(201).send({ message: "Produto criado com sucesso!!" });
};

export const updateExistingProduct = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<UpdateProduct>;
  }>,
  reply: FastifyReply,
) => {
  const id = Number(request.params.id);
  const body = normalizeProductUpdate(request.body);

  const validation = updateProductSchema.safeParse(body);

  if (!validation.success) {
    return reply.status(400).send({
      message: "Erro de validação ao atualizar produto",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join(".") : "body",
        message: issue.message,
      })),
    });
  }

  const validate = validation.data;

  if (validate.name) {
    validate.slug = generateSlug(validate.name);
  }

  const product = await updateProduct(id, validate);

  reply.status(200).send(product);
};

export const deleteExistingProduct = async (
  request: FastifyRequest<{
    Params: { id: number };
  }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  const validate = deleteProductSchema.parse({ id });

  await deleteProduct(validate.id);

  return reply.status(200).send({ message: "Produto removido com sucesso" });
};
