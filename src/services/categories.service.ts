import { prisma } from "../lib/prisma";

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
