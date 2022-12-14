import { connectToDatabase } from "core/database";
import { createHttpApplication } from "core/http";

export default function startApplication() {
  connectToDatabase();
  createHttpApplication();
}
