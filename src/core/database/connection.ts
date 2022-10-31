import config from "@mongez/config";
import chalk from "chalk";
import { MongoClient } from "mongodb";

export class Connection {
  /**
   * Mongo Client
   */
  public client?: MongoClient;

  /**
   * Connect to the database
   */
  public async connect() {
    const host = config.get("database.host", "localhost");
    const port = config.get("database.port", 27017);
    const username = config.get("database.username", "");
    const password = config.get("database.password", "");

    try {
      this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log(
        chalk.green("Connected!"),
        !username || !password
          ? chalk.red("Your not making a secure authenticated connection!")
          : "",
      );
    } catch (error) {
      console.log(error);
    }
  }
}

const connection = new Connection();

export default connection;
