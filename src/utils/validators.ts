import z from "zod";

const parseNumber = (value: unknown) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 carateres"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 carateres"),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const productFiltersSchema = z
  .object({
    page: z
      .preprocess((value) => parseNumber(value), z.number().int().positive())
      .optional(),
    limit: z
      .preprocess((value) => parseNumber(value), z.number().int().positive())
      .optional(),
    category: z.string().min(1, "Categoria inválida").optional(),
    priceMin: z
      .preprocess((value) => parseNumber(value), z.number().nonnegative())
      .optional(),
    priceMax: z
      .preprocess((value) => parseNumber(value), z.number().nonnegative())
      .optional(),
    search: z.string().min(1, "Busca inválida").optional(),
    sortBy: z.enum(["price", "name", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) =>
      data.priceMin === undefined ||
      data.priceMax === undefined ||
      data.priceMin <= data.priceMax,
    {
      message: "priceMin deve ser menor ou igual a priceMax",
      path: ["priceMin"],
    },
  );
