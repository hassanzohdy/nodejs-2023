import connection from "./connection";
import database from "./database";
export { Connection } from "./connection";
export { Database } from "./database";
export { connection };

export default database;

export function connectToDatabase() {
  connection.connect();
}
