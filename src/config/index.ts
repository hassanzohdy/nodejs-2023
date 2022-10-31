import config from "@mongez/config";
import { databaseConfigurations } from "config/database";

config.set({
  database: databaseConfigurations,
});
