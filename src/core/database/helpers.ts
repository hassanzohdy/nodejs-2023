import chalk from "chalk";
import { Table } from "console-table-printer";
import database, { connection, connectToDatabase } from ".";

export function listDatabaseIndexes() {
  onceConnected(async () => {
    const collectionNames = await database.listCollectionNames();

    for (const collection of collectionNames) {
      // create a table in the console and print the collection name with its collection indexes
      const indexes = await database.collection(collection).indexes();

      const table = new Table({
        title:
          chalk.cyanBright(collection) +
          " Collection " +
          `${chalk.greenBright(indexes.length)} Indexes`,
        columns: [
          {
            name: "Normal Indexes",
            minLen: 20,
          },
          {
            name: "Unique Indexes",
            minLen: 20,
          },
          {
            name: "Geo Indexes",
            minLen: 20,
          },
          {
            name: "Text Indexes",
            minLen: 20,
          },
        ],
      });

      const indexesTypes: any = {
        unique: [],
        geo: [],
        normal: [],
        text: [],
      };

      for (const index of indexes) {
        let isNormalIndex = true;
        if (index.unique) {
          indexesTypes.unique.push(index.name);
          isNormalIndex = false;
          table.addRow({
            "Unique Indexes": chalk.greenBright(index.name),
          });
        }

        if (index["2dsphereIndexVersion"]) {
          indexesTypes.geo.push(index.name);
          isNormalIndex = false;
          table.addRow({
            "Geo Indexes": chalk.magentaBright(index.name),
          });
        }

        // check if text index
        if (index.weights) {
          indexesTypes.text.push(index.name);
          isNormalIndex = false;
          table.addRow({
            "Text Indexes": chalk.yellow(index.name),
          });
        }

        if (isNormalIndex) {
          indexesTypes.normal.push(index.name);
          table.addRow({
            "Normal Indexes": index.name,
          });
        }
      }

      table.printTable();
    }

    process.exit();
  });
}

export function onceConnected(callback: any) {
  connectToDatabase();
  if (connection.isConnected()) {
    callback();
  } else {
    connection.on("connected", callback);
  }
}
