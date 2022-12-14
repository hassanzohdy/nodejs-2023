import ConsoleLog from "./channels/ConsoleLog";
import LogChannel from "./LogChannel";
import { LogLevel } from "./types";

export class Logger {
  /**
   * Current channel
   */
  protected channels: LogChannel[] = [new ConsoleLog()];

  /**
   * Add a new channel
   */
  public useChannel(channel: LogChannel) {
    this.channels.push(channel);

    return this;
  }

  /**
   * Set channels
   */
  public setChannels(channels: LogChannel[]) {
    this.channels = channels;

    return this;
  }

  /**
   * Make log
   */
  public log(module: string, action: string, message: any, level: LogLevel) {
    for (const channel of this.channels) {
      channel.log(module, action, message, level);
    }

    return this;
  }

  /**
   * Make debug log
   */
  public debug(module: string, action: string, message: any = "") {
    return this.log(module, action, message, "debug");
  }

  /**
   * Make info log
   */
  public info(module: string, action: string, message: any = "") {
    return this.log(module, action, message, "info");
  }

  /**
   * Make warn log
   */
  public warn(module: string, action: string, message: any = "") {
    return this.log(module, action, message, "warn");
  }

  /**
   * Make error log
   */
  public error(module: string, action: string, message: any = "") {
    return this.log(module, action, message, "error");
  }

  /**
   * Make success log
   */
  public success(module: string, action: string, message: any = "") {
    return this.log(module, action, message, "success");
  }
}

const logger = new Logger();

export default logger;

export function log(
  module: string,
  action: string,
  message: any,
  level: LogLevel,
) {
  return logger.log(module, action, message, level);
}

log.info = logger.info.bind(logger);
log.debug = logger.debug.bind(logger);
log.warn = logger.warn.bind(logger);
log.error = logger.error.bind(logger);
log.success = logger.success.bind(logger);
