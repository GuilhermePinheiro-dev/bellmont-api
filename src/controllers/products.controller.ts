import { FastifyReply, FastifyRequest } from "fastify";
import { getProducts, getProductsById } from "../services/products.service";
import { productFiltersSchema } from "../utils/validators";
import { ProductFilters } from "../types";

export const listProducts = async (
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply,
) => {
  const filters = productFiltersSchema.parse(request.query);
  const result = await getProducts(filters as ProductFilters);
  return reply.status(200).send(result);
};

export const getProduct =  async (request: FastifyRequest<{Params: {id: string}}>, reply: FastifyReply) => {
  const product = await getProductsById(Number(request.params.id))

  reply.status(200).send(product)
}