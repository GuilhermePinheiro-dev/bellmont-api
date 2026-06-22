import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { OrderFilters, OrderStatus, SaveOrder } from "../types";

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          active: true,
        },
      },
    },
  },
};

const normalizeItems = (items: SaveOrder["items"]) => {
  const groupedItems = new Map<number, number>();

  for (const item of items) {
    groupedItems.set(
      item.productId,
      (groupedItems.get(item.productId) ?? 0) + item.quantity,
    );
  }

  return Array.from(groupedItems, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

export const createOrder = async (data: SaveOrder) => {
  const items = normalizeItems(data.items);
  const productIds = items.map((item) => item.productId);
  const shipping = data.shipping ?? 0;
  const discount = data.discount ?? 0;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: data.userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("Um ou mais produtos não foram encontrados");
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItems = items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      if (!product.active) {
        throw new Error(`Produto ${product.name} está inativo`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}`);
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const subtotal = orderItems.reduce((total, item) => total + item.subtotal, 0);
    const total = subtotal + shipping - discount;

    if (total < 0) {
      throw new Error("Total do pedido não pode ser negativo");
    }

    for (const item of orderItems) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          active: true,
          stock: { gte: item.quantity },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count === 0) {
        throw new Error("Estoque insuficiente para concluir o pedido");
      }
    }

    return tx.order.create({
      data: {
        userId: data.userId,
        subtotal,
        shipping,
        discount,
        total,
        shippingAddress: data.shippingAddress as unknown as Prisma.InputJsonObject,
        items: {
          create: orderItems,
        },
      },
      include: orderInclude,
    });
  });
};

export const getOrders = async (userId: number, filters: OrderFilters) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const sortOrderValue = filters.sortOrder?.toLowerCase() === "desc" ? "desc" : "asc";
  const sortByMap: Record<string, "total" | "createdAt" | "status"> = {
    total: "total",
    createdAt: "createdAt",
    created_at: "createdAt",
    status: "status",
  };
  const normalizedSortBy = filters.sortBy
    ? sortByMap[filters.sortBy]
    : undefined;

  return prisma.order.findMany({
    where: {
      userId,
      status: filters.status,
      paymentStatus: filters.paymentStatus,
      total: {
        gte: filters.totalMin,
        lte: filters.totalMax,
      },
    },
    include: orderInclude,
    orderBy: normalizedSortBy
      ? { [normalizedSortBy]: sortOrderValue }
      : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
};

export const getOrderById = async (userId: number, id: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    include: orderInclude,
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  return order;
};

export const updateOrderStatus = async (
  userId: number,
  id: number,
  status: OrderStatus,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.status === "CANCELED") {
    throw new Error("Pedido já está cancelado");
  }

  if (status === "CANCELED") {
    return prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status },
        include: orderInclude,
      });
    });
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
};

export const cancelOrder = async (userId: number, id: number) => {
  return updateOrderStatus(userId, id, "CANCELED");
};
