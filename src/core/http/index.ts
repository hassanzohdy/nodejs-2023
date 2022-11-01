import multipart from "@fastify/multipart";
import router from "core/router";
import Fastify from "fastify";

export default async function connectToServer() {
  const server = Fastify();

  server.register(multipart, {
    attachFieldsToBody: true,
  });

  router.scan(server);

  try {
    // 👇🏻 We can use the url of the server
    const address = await server.listen({ port: 3000 });

    console.log(`Start browsing using ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1); // stop the process, exit with error
  }
}
