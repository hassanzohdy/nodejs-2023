import { putFile } from "@mongez/fs";
import dayjs from "dayjs";
import { EOL } from "os";
import LogChannel from "../LogChannel";
import { DebugMode, LogLevel } from "../types";

export default class FileLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "file";

  /**
   * Debug mode
   */
  public currentDebugMode: DebugMode = DebugMode.daily;

  /**
   * Set debug mode
   */
  public debugMode(debugMode: DebugMode) {
    this.currentDebugMode = debugMode;

    return this;
  }

  /**
   * {@inheritdoc}
   */
  public async log(
    message: any,
    level: LogLevel,
    debugMode: DebugMode = this.currentDebugMode,
  ) {
    // check for debug mode

    const fileName = this.getFileName(debugMode);

    // check if message is an instance of Error
    if (message instanceof Error) {
      // in that case we need to store the error message and stack trace
      let content = `[${level}]` + message.message + EOL;
      content += `[trace]` + EOL;
      content += message.stack;

      message = content;
    } else {
      message = `[${level}] ${message}`;
    }

    putFile(`logs/${fileName}`, message + EOL);
  }

  /**
   * Get file name
   */
  protected getFileName(debugMode: DebugMode) {
    let fileName = "";

    switch (debugMode) {
      case DebugMode.hourly:
        // file name will be like: 2021-01-01-12-00.log
        fileName = dayjs().format("YYYY-MM-DD-HH-00.log");
        break;

      case DebugMode.daily:
        // file name will be like: 2021-01-01.log
        fileName = dayjs().format("YYYY-MM-DD.log");
        break;

      case DebugMode.monthly:
        // file name will be like: 2021-01.log
        fileName = dayjs().format("YYYY-MM.log");
        break;

      case DebugMode.yearly:
        // file name will be like: 2021.log
        fileName = dayjs().format("YYYY.log");
        break;
    }

    return fileName;
  }
}
