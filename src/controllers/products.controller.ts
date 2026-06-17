import { FastifyReply, FastifyRequest } from "fastify";
import {
  getProducts,
  getProductsById,
  saveProduct,
  updateProduct,
} from "../services/products.service";
import {
  createProductSchema,
  productFiltersSchema,
  updateProductSchema,
} from "../utils/validators";
import { CreateProduct, ProductFilters, UpdateProduct } from "../types";
import slugify from "slugify";

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
  body.slug = slugify(body.name, {
    lower: true,
    strict: true,
    locale: "pt",
  });

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
  const body = request.body;

  const validate = updateProductSchema.parse(body);

  if (validate.name) {
    validate.slug = slugify(validate.name, {
      lower: true,
      strict: true,
      locale: "pt",
    });
  }

  const product = await updateProduct(id, validate);

  reply.status(200).send(product);
};
