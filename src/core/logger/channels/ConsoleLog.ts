import chalk from "chalk";
import LogChannel from "../LogChannel";
import { LogLevel } from "../types";

export default class ConsoleLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "console";

  /**
   * {@inheritdoc}
   */
  public log(module: string, action: string, message: any, level: LogLevel) {
    switch (level) {
      case "debug":
        // add a debug icon
        console.log(
          chalk.magentaBright("⚙"),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.magentaBright(message),
        );
        break;
      case "info":
        // add an info icon
        console.log(
          chalk.blueBright("ℹ"),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.blueBright(message),
        );
        break;
      case "warn":
        // add a warning icon
        console.log(
          chalk.yellow("⚠"),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.yellowBright(message),
        );
        break;

      case "error":
        // add an error icon
        console.log(
          chalk.red("✗"),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.redBright(message),
        );
        break;

      case "success":
        // add a success icon
        console.log(
          chalk.green("✓"),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.greenBright(message),
        );
        break;

      default:
        console.log(
          "[log]",
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          message,
        );
    }

    if (message instanceof Error) {
      console.log(message.stack);
    }
  }
}
