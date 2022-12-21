import config from "@mongez/config";
import databaseConfigurations from "config/database";
import appConfigurations from "./app";
import authConfigurations from "./auth";
import httpConfigurations from "./http";
import { mailConfigurations } from "./mail";
import validationConfigurations from "./validation";

config.set({
  database: databaseConfigurations,
  validation: validationConfigurations,
  app: appConfigurations,
  auth: authConfigurations,
  http: httpConfigurations,
  mail: mailConfigurations,
});
