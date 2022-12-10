import { Casts, Model } from "core/database";

export default class Post extends Model {
  /**
   * Collection name
   */
  public static collectionName = "posts";

  /**
   * {@inheritDoc}
   */
  protected casts: Casts = {
    name: "string",
    image: "string",
  };
}
