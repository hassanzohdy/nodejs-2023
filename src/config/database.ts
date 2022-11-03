import { env } from "@mongez/dotenv";

const databaseConfigurations = {
  host: env("DB_HOST", "localhost"),
  port: env("DB_PORT", 27017),
  username: env("DB_USERNAME"),
  password: env("DB_PASSWORD"),
  name: env("DB_NAME"),
};

export default databaseConfigurations;
