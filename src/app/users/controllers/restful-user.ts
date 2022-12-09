import { Request, Response } from "core/http";
import Restful from "core/router/restful";
import { RouteResource } from "core/router/types";
import User from "../models/user";

class RestfulUser extends Restful<User> implements RouteResource {
  /**
   * Base model
   */
  protected model = User;

  /**
   * Get single record
   */
  public async get(request: Request, response: Response) {
    //
  }

  /**
   * Create record
   */
  public async create(request: Request) {
    //
  }

  /**
   * Update record
   */
  public async update(request: Request, response: Response) {
    //
  }

  /**
   * Delete record
   */
  public async delete(request: Request, response: Response) {
    //
  }

  /**
   * Patch record
   */
  public async patch(request: Request, response: Response) {
    //
  }
}

const restfulUser = new RestfulUser();

export default restfulUser;
