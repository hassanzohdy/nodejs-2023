import { BluePrint } from "core/database";
import { UserGroupBlurPrint } from "../usersGroup";
import User from "./user";

export default class UserBluePrint extends BluePrint {
  /**
   * {@inheritdoc}
   */
  public static model = User;

  /**
   * {@inheritDoc}
   */
  public static schema = BluePrint.baseSchemaWith({
    name: "string",
    email: "string",
    password: "string",
    group: UserGroupBlurPrint,
  });
}
