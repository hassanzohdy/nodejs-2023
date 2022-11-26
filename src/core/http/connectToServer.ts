import config from "@mongez/config";
import router from "core/router";
import registerHttpPlugins from "./plugins";
import response from "./response";
import { getServer } from "./server";

export default async function connectToServer() {
  const server = getServer();

  await registerHttpPlugins();

  // call reset method on response object to response its state
  server.addHook("onResponse", response.reset.bind(response));

  router.scan(server);

  try {
    // 👇🏻 We can use the url of the server
    const address = await server.listen({
      port: config.get("app.port"),
      host: config.get("app.baseUrl"),
    });

    console.log(`Start browsing using ${address}`);
  } catch (err) {
    console.log(err);

    server.log.error(err);
    process.exit(1); // stop the process, exit with error
  }
}
