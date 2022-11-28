import { connectToDatabase } from "core/database";
import { createHttpApplication } from "core/http";

export default async function startApplication() {
  connectToDatabase();
  createHttpApplication();
}
