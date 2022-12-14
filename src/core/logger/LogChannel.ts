import { LogLevel } from "./types";

export default abstract class LogChannel {
  /**
   * Channel name
   */
  public name!: string;

  /**
   * Channel description
   */
  public description?: string;

  /**
   * Log the given message
   */
  public abstract log(
    module: string,
    action: string,
    message: any,
    level: LogLevel,
  ): void | Promise<void>;
}
