import { Resource, ResourceOutput } from "core/resources";

export default class UserResource extends Resource {
  /**
   * Output data
   */
  protected output: ResourceOutput = {
    isActive: "boolean",
    isPhoneVerified: "boolean",
    joinDate: "date",
    createdAt: "date",
    updatedAt: "date",
    name: "string",
    email: "string",
    image: "uploadsUrl",
    createdBy: UserResource,
  };

  /**
   * Defaults when key is missing from resource
   */
  protected defaults = {};

  /**
   * {@inheritDoc}
   */
  protected async boot() {
    this.set("outputFromUserResource", true);
  }
}
