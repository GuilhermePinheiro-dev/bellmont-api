import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

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
