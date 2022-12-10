import { BluePrint } from "core/database";
import AccessToken from "./access-token";

export default class AccessTokenBluePrint extends BluePrint {
  /**
   * {@inheritdoc}
   */
  public static model = AccessToken;

  /**
   * {@inheritDoc}
   */
  public static schema = BluePrint.baseSchemaWith({
    token: "string",
    userType: "string",
  });
}
