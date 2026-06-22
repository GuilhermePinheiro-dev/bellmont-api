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
    categoryId: z
      .preprocess((value) => parseNumber(value), z.number().int().positive())
      .optional(),
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

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().nonnegative("Preço deve ser positivo"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  slug: z.string().min(1, "Slug é obrigatório"),
  stock: z.number().int().nonnegative("Estoque deve ser positivo"),
  active: z.boolean(),
  images: z.array(z.string()).optional(),
  category: z.string().min(1, "Categoria inválida").optional(),
  categoryId: z
    .preprocess((value) => parseNumber(value), z.number().int().positive())
    .optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  active: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  slug: z.string().min(1, "Slug é obrigatório").optional(),
  active: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  description: z.string().optional(),
  price: z.number().nonnegative("Preço deve ser positivo").optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  slug: z.string().min(1, "Slug é obrigatório").optional(),
  stock: z.number().int().nonnegative("Estoque deve ser positivo").optional(),
  active: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().min(1, "Categoria inválida").optional(),
  categoryId: z
    .preprocess((value) => parseNumber(value), z.number().int().positive())
    .optional(),
});

export const deleteProductSchema = z.object({
  id: z.number().int().min(1, "ID inválido"),
});

export const categoryIdSchema = z.object({
  id: z.number().int().min(1, "ID inválido"),
});

export const deleteCategorySchema = z.object({
  id: z.number().int().min(1, "ID inválido"),
});
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.preprocess(
          (value) => parseNumber(value),
          z.number().int().positive("Produto inválido"),
        ),
        quantity: z.preprocess(
          (value) => parseNumber(value),
          z.number().int().positive("Quantidade deve ser maior que zero"),
        ),
      }),
    )
    .min(1, "Pedido deve ter ao menos um item"),
  shippingAddress: z.object({
    cep: z
      .string()
      .regex(/^\d{8}$/, "CEP deve conter 8 dígitos"),
    street: z.string().min(1, "Rua/Avenida é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z
      .string()
      .length(2, "Estado deve conter a UF com 2 caracteres"),
    country: z.string().default("BR"),
  }),
  shipping: z
    .preprocess((value) => parseNumber(value), z.number().nonnegative())
    .optional(),
  discount: z
    .preprocess((value) => parseNumber(value), z.number().nonnegative())
    .optional(),
});

export const orderIdSchema = z.object({
  id: z.number().int().min(1, "ID inválido"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"], {
    message: "Status do pedido inválido",
  }),
});

export const orderFiltersSchema = z.object({
  page: z
    .preprocess((value) => parseNumber(value), z.number().int().positive())
    .optional(),
  limit: z
    .preprocess((value) => parseNumber(value), z.number().int().positive())
    .optional(),
  status: z
    .enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"], {
      message: "Status do pedido inválido",
    })
    .optional(),
  paymentStatus: z
    .enum(["PENDING", "PAID", "FAILED", "REFUNDED"], {
      message: "Status de pagamento inválido",
    })
    .optional(),
  totalMin: z
    .preprocess((value) => parseNumber(value), z.number().nonnegative())
    .optional(),
  totalMax: z
    .preprocess((value) => parseNumber(value), z.number().nonnegative())
    .optional(),
  sortBy: z.enum(["total", "createdAt", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})
.refine(
  (data) =>
    data.totalMin === undefined ||
    data.totalMax === undefined ||
    data.totalMin <= data.totalMax,
  {
    message: "totalMin deve ser menor ou igual a totalMax",
    path: ["totalMin"],
  },
);
