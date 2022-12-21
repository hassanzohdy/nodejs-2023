import { appendFile, ensureDirectory, fileExists, touch } from "@mongez/fs";
import { storagePath } from "core/utils/paths";
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
  public log(module: string, action: string, message: any, level: LogLevel) {
    // check for debug mode

    const fileName = this.getFileName(this.currentDebugMode);

    const logsDirectory = storagePath("logs");

    ensureDirectory(logsDirectory);

    const filePath = logsDirectory + "/" + fileName;

    if (!fileExists(filePath)) {
      touch(filePath);
    }

    const date = dayjs().format("DD-MM-YYYY HH:mm:ss");

    let content = `[${date}] [${level}] [${module}][${action}]: `;

    // check if message is an instance of Error
    if (message instanceof Error) {
      // in that case we need to store the error message and stack trace
      content += message.message + EOL;
      content += `[trace]` + EOL;
      content += message.stack;
    } else {
      content += message;
    }

    appendFile(filePath, content + EOL);
  }

  /**
   * Get file name
   */
  protected getFileName(debugMode: DebugMode) {
    let fileName = "";

    switch (debugMode) {
      case DebugMode.hourly:
        // file name will be like: 2021-01-01-12-00.log
        fileName = dayjs().format("DD-MM-YYYY-HH-00.log");
        break;

      case DebugMode.daily:
        // file name will be like: 2021-01-01.log
        fileName = dayjs().format("DD-MM-YYYY.log");
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
