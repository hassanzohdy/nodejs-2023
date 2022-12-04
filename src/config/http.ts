import { env } from "@mongez/dotenv";
import { HttpConfigurations } from "core/http";

const httpConfigurations: HttpConfigurations = {
  port: env("PORT", 3000),
  host: env("HOST", "localhost"),
  middleware: {
    // apply the middleware to all routes
    all: [],
    // apply the middleware to specific routes
    only: {
      // routes: [],
      // namedRoutes: ["users.list"],
      // middleware: [authMiddleware("user")],
      routes: [],
      namedRoutes: [],
      middleware: [],
    },
    // exclude the middleware from specific routes
    except: {
      routes: [],
      namedRoutes: [],
      middleware: [],
    },
  },
};

export default httpConfigurations;
