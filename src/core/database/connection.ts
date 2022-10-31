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
    try {
      this.client = await MongoClient.connect("mongodb://localhost:27017", {
        auth: {
          username: "root",
          password: "root",
        },
      });
      console.log("Connected!");
    } catch (error) {
      console.log(error);
    }
  }
}

const connection = new Connection();

export default connection;
