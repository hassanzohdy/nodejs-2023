import Resource from "../../../core/resources/resource";

export default class AddressResource extends Resource {
  /**
   * Output data
   */
  protected output: any = {
    name: "string",
    age: "number",
    image: "string",
  };
}
