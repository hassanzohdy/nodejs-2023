import Fastify from "fastify";
import Router from "./core/router";

const router = new Router();
const server = Fastify();

router.get("/", (request: any, response: any) => {
  response.send("Hello World!");
});

async function start() {
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

start();
