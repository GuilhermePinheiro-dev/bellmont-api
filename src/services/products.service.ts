import { sl } from "zod/v4/locales";
import { prisma } from "../lib/prisma";
import { CreateProduct, ProductFilters, UpdateProduct } from "../types";

export const getProducts = async (filter: ProductFilters) => {
  const {
    page = 1,
    limit = 10,
    category,
    priceMin,
    priceMax,
    search,
    sortBy,
    sortOrder,
  } = filter;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const parsedPriceMin = priceMin !== undefined ? Number(priceMin) : undefined;
  const parsedPriceMax = priceMax !== undefined ? Number(priceMax) : undefined;

  const where: any = {};

  if (category) {
    where.name = { contains: category, mode: "insensitive" };
  }

  if (parsedPriceMin !== undefined && !Number.isNaN(parsedPriceMin)) {
    where.price = { ...where.price, gte: parsedPriceMin };
  }

  if (parsedPriceMax !== undefined && !Number.isNaN(parsedPriceMax)) {
    where.price = { ...where.price, lte: parsedPriceMax };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const sortOrderValue = sortOrder?.toLowerCase() === "desc" ? "desc" : "asc";
  const sortByMap: Record<string, "price" | "name" | "createdAt"> = {
    price: "price",
    name: "name",
    createdAt: "createdAt",
    created_at: "createdAt",
  };
  const normalizedSortBy = sortBy ? sortByMap[sortBy] : undefined;

  const orderBy = normalizedSortBy
    ? { [normalizedSortBy]: sortOrderValue }
    : undefined;

  const result = await prisma.product.findMany({
    where,
    orderBy,
    skip:
      parsedPage > 0
        ? (parsedPage - 1) * (parsedLimit > 0 ? parsedLimit : 10)
        : 0,
    take: parsedLimit > 0 ? parsedLimit : 10,
  });

  return result;
};

export const getProductsById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product não encontrado");
  }

  return product;
};

export const saveProduct = async (data: CreateProduct) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProduct) {
    throw new Error("Slug já existe. Escolha outro nome para o produto");
  }

  const newProduct = await prisma.product.create({
    data,
  });

  return newProduct;
};

export const updateProduct = async (id: number, data: UpdateProduct) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Erro! Produto não encontrado");
  }

  if (data.slug) {
    const slugExists = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists && slugExists.id !== id) {
      throw new Error("Slug já existe. Escolha outro nome para o produto");
    }
  }

  const updateProduct = await prisma.product.update({
    where: { id },
    data,
  });

  return updateProduct
};
