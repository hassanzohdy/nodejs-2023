import { env } from "@mongez/dotenv";
import { authMiddleware } from "core/auth/auth-middleware";
import { HttpConfigurations } from "core/http";

const httpConfigurations: HttpConfigurations = {
  port: env("PORT", 3000),
  host: env("HOST", "localhost"),
  middleware: {
    // apply the middleware to all routes
    all: [],
    // apply the middleware to specific routes
    only: {
      routes: [],
      namedRoutes: ["users.list"],
      middleware: [authMiddleware("guest")],
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
