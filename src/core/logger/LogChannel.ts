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
   * Determine if channel is logging in terminal
   */
  public terminal = false;

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
