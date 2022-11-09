import config from "@mongez/config";
import events from "@mongez/events";
import chalk from "chalk";
import { MongoClient } from "mongodb";
import database, { Database } from "./database";

export type ConnectionEvent = "connected" | "error" | "close";

export class Connection {
  /**
   * Mongo Client
   */
  public client?: MongoClient;

  /**
   * Database instance
   */
  public database!: Database;

  /**
   * Connect to the database
   */
  public async connect() {
    const { host, port, username, password, name } = this.configurations;

    try {
      this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
        auth: {
          username: username,
          password: password,
        },
      });

      const mongoDBDatabase = await this.client.db(name);

      this.database = database.setDatabase(mongoDBDatabase);

      this.trigger("connected", this);

      // listen on connection close
      this.client.on("close", () => {
        this.trigger("close", this);
      });

      console.log(
        chalk.green("Connected!"),
        !username || !password
          ? chalk.red("Your not making a secure authenticated connection!")
          : "",
      );
    } catch (error) {
      this.trigger("error", error);
    }
  }

  /**
   * Trigger the given event
   */
  protected trigger(eventName: ConnectionEvent, ...args: any[]) {
    return events.trigger(`database.connection.${eventName}`, ...args);
  }

  /**
   * Subscribe to one of connection events
   */
  public on(eventName: ConnectionEvent, callback: any) {
    return events.subscribe(`database.connection.${eventName}`, callback);
  }

  /**
   * Get database configurations
   */
  public get configurations() {
    return {
      host: config.get("database.host", "localhost"),
      port: config.get("database.port", 27017),
      username: config.get("database.username", ""),
      password: config.get("database.password", ""),
      name: config.get("database.name", ""),
    };
  }
}

const connection = new Connection();

export default connection;
