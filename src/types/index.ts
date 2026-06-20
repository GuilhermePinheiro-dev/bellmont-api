export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  firstName: string;
  lastName: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  role?: "USER" | "ADMIN";
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  colors?: string[];
  sizes?: string[];
  slug: string;
  stock: number;
  active: boolean;
  images?: string[];
  categoryId?: number;
}

export interface UpdateProduct extends Partial<CreateProduct> {
  name?: string;
  description?: string;
  price?: number;
  slug?: string;
  stock?: number;
  active?: boolean;
}

export interface DeleteProduct {
  id: number;
}

export interface CreateCategory {
  name: string;
  slug: string;
  active?: boolean;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  name?: string;
  slug?: string;
  active?: boolean;
}

export interface DeleteCategory {
  id: number;
}
