import { Restful, RouteResource } from "core/router";
import { UniqueRule } from "core/validator";
import { User } from "../models/user";

class RestfulUsers extends Restful<User> implements RouteResource {
  /**
   * {@inheritDoc}
   */
  protected model = User;

  /**
   * {@inheritDoc}
   */
  public validation: RouteResource["validation"] = {
    all: {
      rules: {
        email: ["required", "email", new UniqueRule(User).except("id")],
      },
    },
  };
}

const restfulUsers = new RestfulUsers();

export default restfulUsers;
