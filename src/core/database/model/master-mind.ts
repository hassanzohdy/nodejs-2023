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
  public async generateNextId(
    collectionName: string,
    incrementIdBy = 1,
    initialId = 1,
  ): Promise<number> {
    const query = this.connection.database.collection(this.collectionName);

    const collectionDocument = await query.findOne({
      collection: collectionName,
    });

    if (collectionDocument) {
      const nextId = collectionDocument.id + incrementIdBy;

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
        id: initialId,
      });

      return initialId;
    }
  }
}

const masterMind = new MasterMind();

export default masterMind;
