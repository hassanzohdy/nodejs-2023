import { env } from "@mongez/dotenv";

const appConfigurations = {
  debug: env("DEBUG", false),
};

export default appConfigurations;
