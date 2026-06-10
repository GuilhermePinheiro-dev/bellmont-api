import { FastifyReply, FastifyRequest } from "fastify";
import { getProducts } from "../services/products.service";
import { productFiltersSchema } from "../utils/validators";
import { ProductFilters } from "../types";

export const listProducts = async (
  request: FastifyRequest<{ Querystring: unknown }>,
  reply: FastifyReply,
) => {
  const filters = productFiltersSchema.parse(request.query);
  const result = await getProducts(filters as ProductFilters);
  return reply.send(result);
};
