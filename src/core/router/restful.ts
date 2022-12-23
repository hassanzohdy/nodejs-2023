import User from "app/users/models/user/user";
import { ChildModel, Model } from "core/database";
import { Request, Response } from "core/http";
import { log } from "core/logger";
import { RestfulMiddleware, RouteResource } from "core/router";

export default class Restful<T extends Model> implements RouteResource {
  /**
   * Base model
   */
  protected model?: ChildModel<T>;

  /**
   * Middleware for each method
   */
  protected middleware: RestfulMiddleware = {};

  /**
   * Record name
   */
  protected recordName = "record";

  /**
   * Records list name
   */
  protected recordsListName = "records";

  /**
   * Define what to be returned when a record is created|updated|deleted|patched
   */
  protected returnOn: Record<string, "record" | "records"> = {
    create: "record",
    update: "record",
    delete: "record",
    patch: "record",
  };

  /**
   * List records
   */
  public async list(request: Request, response: Response) {
    try {
      if (await this.callMiddleware("list", request, response)) return;

      // const filter = request.all();
      // const records = await this.model?.list(filter);
      const query = User.aggregate();

      const { documents, paginationInfo } = await query.paginate(
        request.input("page", 1),
        request.input("limit", 15),
      );

      return response.success({
        [this.recordsListName]: documents,
        paginationInfo,
      });
    } catch (error: any) {
      log.error("restful", "list", error);
      return response.serverError(error);
    }
  }

  /**
   * Call middleware for the given method
   *
   */
  protected async callMiddleware(
    method: string,
    request: Request,
    response: Response,
  ) {
    if (!this.middleware[method]) return;

    for (const middleware of this.middleware[method]) {
      const output = await middleware(request, response);

      if (output) {
        return output;
      }
    }

    return;
  }

  /**
   * Get single record
   */
  public async get(request: Request, response: Response) {
    try {
      const record = await this.model?.find(request.params.id);

      if (!record) {
        return response.notFound({
          error: "Record not found",
        });
      }

      return response.success({
        [this.recordName]: record,
      });
    } catch (error) {
      log.error("restful", "get", error);
    }
  }

  /**
   * Create record
   */
  public async create(request: Request, response: Response) {
    try {
      const record = await this.model?.create(request.all());

      if (this.returnOn.create === "records")
        return this.list(request, response);

      return response.success({
        [this.recordName]: record,
      });
    } catch (error) {
      log.error("restful", "create", error);
    }
  }

  /**
   * Update record
   */
  public async update(request: Request, response: Response) {
    try {
      const record = await this.model?.find(request.query("id"));

      if (this.returnOn.update === "records")
        return this.list(request, response);

      if (!record) {
        return response.notFound({
          error: "Record not found",
        });
      }

      await record.save(request.all());

      return response.success({
        [this.recordName]: record,
      });
    } catch (error) {
      log.error("restful", "update", error);
    }
  }

  /**
   * Delete record
   */
  public async delete(request: Request, response: Response) {
    try {
      const record = await this.model?.find(request.query("id"));

      if (this.returnOn.delete === "records")
        return this.list(request, response);

      if (!record) {
        return response.notFound({
          error: "Record not found",
        });
      }

      await record.destroy();

      return response.success({
        [this.recordName]: record,
      });
    } catch (error) {
      log.error("restful", "delete", error);
    }
  }

  /**
   * Patch record
   */
  public async patch(request: Request, response: Response) {
    try {
      const record = await this.model?.find(request.query("id"));

      if (this.returnOn.patch === "records")
        return this.list(request, response);

      if (!record) {
        return response.notFound({
          error: "Record not found",
        });
      }

      await record.save(request.all());

      return response.success({
        [this.recordName]: record,
      });
    } catch (error) {
      log.error("restful", "patch", error);
    }
  }
}
