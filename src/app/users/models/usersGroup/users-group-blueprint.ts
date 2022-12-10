import { BluePrint } from "core/database";
import UserGroup from "./userGroup";

export default class UsersGroupBluePrint extends BluePrint {
  /**
   * {@inheritdoc}
   */
  public static model = UserGroup;

  /**
   * {@inheritDoc}
   */
  public static schema = BluePrint.baseSchemaWith({
    name: "string",
    permissions: "string[]",
  });
}
