import router from "core/router";
import { httpConfig } from "./config";
import registerHttpPlugins from "./plugins";
import response from "./response";
import { getServer } from "./server";

export default async function createHttpApplication() {
  const server = getServer();

  await registerHttpPlugins();

  // call reset method on response object to response its state
  server.addHook("onResponse", response.reset.bind(response));

  router.scan(server);

  try {
    // 👇🏻 We can use the url of the server
    const address = await server.listen({
      port: httpConfig("port"),
      host: httpConfig("host"),
    });

    console.log(`Start browsing using ${address}`);
  } catch (err) {
    console.log(err);

    server.log.error(err);
    process.exit(1); // stop the process, exit with error
  }
}
