import connection from "./connection";
import database from "./database";
export { default as BluePrint } from "./blueprint";
export { Connection } from "./connection";
export { Database } from "./database";
export { default as migrate } from "./migrate";
export * from "./model";
export { connection };

export default database;

export function connectToDatabase() {
  connection.connect();
}
