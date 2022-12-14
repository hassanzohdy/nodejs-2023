import User from "app/users/models/user/user";
import { ChildModel, Model } from "core/database";
import { Request, Response } from "core/http";
import { RouteResource } from "core/router/types";

export default class Restful<T extends Model> implements RouteResource {
  /**
   * Base model
   */
  protected model?: ChildModel<T>;

  /**
   * List records
   */
  public async list(request: Request, response: Response) {
    // const filter = request.all();
    // const records = await this.model?.list(filter);
    const query = User.aggregate();

    return response.success({
      records: await query.get(),
    });
  }

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
