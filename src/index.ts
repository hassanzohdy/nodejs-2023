import Fastify from "fastify";

const server = Fastify();

server.get("/", (request, response) => {
  response.send("Hello World!");
});

async function start() {
  await server.listen({ port: 3000 });

  console.log("Start browsing using http://localhost:3000");
}

start();
