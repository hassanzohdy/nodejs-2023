import Fastify from "fastify";
import router from "./router";

export default async function startApplication() {
  const server = Fastify();

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
