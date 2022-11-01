import { connectToDatabase } from "core/database";
import connectToServer from "core/http";

export default async function startApplication() {
  connectToDatabase();
  connectToServer();
}
