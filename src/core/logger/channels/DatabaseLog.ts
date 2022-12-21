import LogChannel from "../LogChannel";
import Log from "../models/Log";
import { LogLevel } from "../types";

export default class DatabaseLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "database";

  /**
   * Database model
   */
  public model = Log;

  /**
   * {@inheritdoc}
   */
  public log(module: string, action: string, message: any, level: LogLevel) {
    if (!this.model.connection.isConnected()) return;
    const data: any = {
      module,
      action,
      message,
      level,
    };

    if (message instanceof Error) {
      data.trace = message.stack;
      data.message = message.message;
    }

    this.model.create(data);
  }
}
