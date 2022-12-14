import { log } from "core/logger";
import router from "core/router";
import { setBaseUrl } from "core/utils/urls";
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
    log.info("http", "server", "Connecting to the server");
    // 👇🏻 We can use the url of the server
    const baseUrl = await server.listen({
      port: httpConfig("port"),
      host: httpConfig("host"),
    });

    // update base url
    setBaseUrl(baseUrl);

    log.success("http", "server", `Server is listening on ${baseUrl}`);
  } catch (err) {
    console.log(err);

    server.log.error(err);
    process.exit(1); // stop the process, exit with error
  }
}
