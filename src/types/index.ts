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

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
}

export interface CreateOrder {
  items: CreateOrderItem[];
  shippingAddress: ShippingAddress;
  shipping?: number;
  discount?: number;
}

export interface SaveOrder extends CreateOrder {
  userId: number;
}

export interface UpdateOrderStatus {
  status: OrderStatus;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalMin?: number;
  totalMax?: number;
  sortBy?: "total" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
}
