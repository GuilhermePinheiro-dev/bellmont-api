import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import productRoutes from "./routes/products.routes";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";

const PORT = parseInt(process.env.PORT ?? "3000");

const fastify = Fastify({
  logger: true,
});
fastify.register(cors, {
  credentials: true,
  origin: true,
});

fastify.register(helmet, {
  contentSecurityPolicy: false,
});

fastify.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Bellmont API",
      description: "API para o e-commerce Bellmont",
      version: "1.0.0 ",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Autenticação via token  JWT",
        },
      },
    },
  },
});

fastify.register(scalar, {
  routePrefix: "/api-docs",
  configuration: {
    theme: "dark"
  }
})

fastify.register(productRoutes, { prefix: "/products" });

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/health", async (request, reply) => {
  return {
    status: "ok",
    timeStamp: Date().toString(),
  };
});

fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

export default fastify;
