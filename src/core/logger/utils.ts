import { log } from "./logger";

export function captureAnyUnhandledRejection() {
  process.on("unhandledRejection", (reason: string, promise) => {
    log.error("app", reason, promise);
  });

  process.on("uncaughtException", error => {
    log.error("app", "error", error);
  });
}

/**
 * Clear message from any terminal codes
 */
export function clearMessage(message: string) {
  // eslint-disable-next-line no-control-regex
  return message.replace(/\u001b[^m]*?m/g, "");
}
