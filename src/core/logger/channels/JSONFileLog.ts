import {
  ensureDirectory,
  fileExists,
  getJsonFile,
  putJsonFile,
} from "@mongez/fs";
import { storagePath } from "core/utils/paths";
import dayjs from "dayjs";
import LogChannel from "../LogChannel";
import { DebugMode, LogLevel } from "../types";

export default class JSONFileLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "jsonFile";

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

    const logsDirectory = storagePath("logs/json");

    ensureDirectory(logsDirectory);

    const filePath = logsDirectory + "/" + fileName;

    if (!fileExists(filePath)) {
      putJsonFile(
        filePath,
        {
          logs: [],
          date: dayjs().format("DD-MM-YYYY"),
        },
        {
          spaces: 2,
        },
      );
    }

    const data: any = {
      level,
      module,
      action,
      message,
      time: dayjs().format("DD-MM-YYYY HH:mm:ss"),
    };

    // check if message is an instance of Error
    if (message instanceof Error) {
      data.trace = message.stack;
    }

    const jsonContent = getJsonFile(filePath);

    jsonContent.logs.push(data);

    putJsonFile(filePath, jsonContent, {
      spaces: 2,
    });
  }

  /**
   * Get file name
   */
  protected getFileName(debugMode: DebugMode) {
    let fileName = "";

    switch (debugMode) {
      case DebugMode.hourly:
        // file name will be like: 15-01-2022-12-00.json
        fileName = dayjs().format("DD-MM-YYYY-HH-00") + ".json";
        break;

      case DebugMode.daily:
        // file name will be like: 15-01-2022.json
        fileName = dayjs().format("DD-MM-YYYY") + ".json";
        break;

      case DebugMode.monthly:
        // file name will be like: 01-2022.json
        fileName = dayjs().format("YYYY-MM") + ".json";
        break;

      case DebugMode.yearly:
        // file name will be like: 2021.json
        fileName = dayjs().format("YYYY") + ".json";
        break;
    }

    return fileName;
  }
}
