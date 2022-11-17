import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { registerPlugin } from "./server";

export default function registerHttpPlugins() {
  // import multipart plugin
  registerPlugin(fastifyMultipart, {
    attachFieldsToBody: true,
  });

  // use the jwt plugin with your preferred secret key
  registerPlugin(fastifyJwt, {
    secret: "my-secret",
  });
}
