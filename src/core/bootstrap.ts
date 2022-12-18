import { loadEnv } from "@mongez/dotenv";
import { captureAnyUnhandledRejection } from "core/logger";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

loadEnv();
dayjs.extend(duration);
dayjs.extend(relativeTime);
captureAnyUnhandledRejection();
