import type { FastifyReply, FastifyRequest } from "fastify";
import { createStripeCheckoutService } from "../services/stripe.service";
import { createOrderSchema } from "../utils/validators";
import { createOrder } from "../services/orders.service";

export class StripeController {
  async createCheckoutSession(request: FastifyRequest, reply: FastifyReply) {
    console.log(request.body);
    
    const { items, shippingAddress, paymentMethod, userId, shippingCost } =
      createOrderSchema.parse(request.body);

    const order = await createOrder({
      items,
      shippingAddress,
      paymentMethod,
      userId,
      shippingCost,
    });

    console.log(order);

    const products = order.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
    }));

    const { sessionId } = await createStripeCheckoutService({
      products,
    });

    return reply.status(200).send({
      sessionId,
    });
  }
}
