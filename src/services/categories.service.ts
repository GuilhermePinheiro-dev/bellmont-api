import { prisma } from "../lib/prisma";
import { CreateCategory, UpdateCategory } from "../types";

export const getCategory = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

export const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return category;
};

export const saveCategory = async (data: CreateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existingCategory) {
    throw new Error("Slug já existe. Escolha outro nome para a categoria");
  }

  const category = await prisma.category.create({
    data: {
      ...data,
      active: data.active ?? true,
    },
  });

  return category;
};

export const updateCategory = async (id: number, data: UpdateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Categoria não encontrada");
  }

  if (data.slug) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists && slugExists.id !== id) {
      throw new Error("Slug já existe. Escolha outro nome para a categoria");
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  return category;
};

export const deleteCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  await prisma.$transaction([
    prisma.product.updateMany({
      where: { categoryId: id },
      data: { active: false },
    }),
    prisma.category.update({
      where: { id },
      data: { active: false },
    }),
  ]);
};
