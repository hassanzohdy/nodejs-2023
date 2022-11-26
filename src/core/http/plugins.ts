import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { registerPlugin } from "./server";

export default async function registerHttpPlugins() {
  // register rate-limit plugin
  await registerPlugin(import("@fastify/rate-limit"), {
    // max requests per time window
    max: 10,
    // maximum time that is will allow max requests
    timeWindow: 60 * 1000,
  });

  // import multipart plugin
  registerPlugin(fastifyMultipart, {
    attachFieldsToBody: true,
  });

  // use the jwt plugin with your preferred secret key
  registerPlugin(fastifyJwt, {
    secret: "my-secret",
  });
}
