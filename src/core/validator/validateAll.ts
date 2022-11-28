import config from "@mongez/config";
import { Request, Response } from "core/http";
import { Route } from "core/router/types";
import Validator from "./validator";

/**
 * Validate the request route
 */
export default async function validateAll(
  validation: Route["handler"]["validation"],
  request: Request,
  response: Response,
) {
  if (validation?.rules) {
    const validator = new Validator(request, validation.rules);

    try {
      await validator.scan(); // start scanning the rules
    } catch (error) {
      console.log(error);
    }

    if (validator.fails()) {
      const responseErrorsKey = config.get(
        "validation.keys.response",
        "errors",
      );

      const responseStatus = config.get("validation.responseStatus", 400);

      return response.send(
        {
          [responseErrorsKey]: validator.errors(),
        },
        responseStatus,
      );
    }
  }

  if (validation?.validate) {
    Validator.trigger("customValidating", validation.validate);
    const result = await validation.validate(request, response);

    Validator.trigger("customDone", result);

    // if there is a result, it means it failed
    if (result) {
      Validator.trigger("customFails", result);

      // check if there is no response status code, then set it to config value or 400 as default
      if (!response.statusCode) {
        response.setStatusCode(config.get("validation.responseStatus", 400));
      }
      return result;
    }

    Validator.trigger("customPasses");
  }
}
