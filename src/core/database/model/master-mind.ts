import connection, { Connection } from "../connection";

export class MasterMind {
  /**
   * Master Mind Collection name
   */
  public collectionName = "MasterMind";

  /**
   * Connection Instance
   */
  protected connection: Connection = connection;

  /**
   * Generate next id for the given collection name
   */
  public async generateNextId(collectionName: string): Promise<number> {
    const query = this.connection.database.collection(this.collectionName);

    const collectionDocument = await query.findOne({
      collection: collectionName,
    });

    if (collectionDocument) {
      const nextId = collectionDocument.id + 1;

      // update the collection with the latest id
      await query.updateOne(
        {
          collection: collectionName,
        },
        {
          $set: {
            id: nextId,
          },
        },
      );

      return nextId;
    } else {
      // if the collection is not found in the master mind table
      // create a new record for it
      await query.insertOne({
        collection: collectionName,
        id: 1,
      });

      return 1;
    }
  }
}

const masterMind = new MasterMind();

export default masterMind;
