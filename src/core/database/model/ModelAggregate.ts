import { toStudlyCase } from "@mongez/reinforcements";
import Aggregate from "../aggregate/aggregate";
import { select } from "../aggregate/SelectPipeline";

export default class ModelAggregate<T> extends Aggregate {
  /**
   * Constructor
   */
  public constructor(protected readonly model: any) {
    super(model.collectionName);
  }

  /**
   * {@inheritDoc}
   */
  public async get() {
    return (await super.get(record => new this.model(record))) as T[];
  }

  /**
   * Join the given alias
   */
  public with(alias: string) {
    const method = `with${toStudlyCase(alias)}`;

    const relation = this.model[method];

    if (!relation) {
      throw new Error(`Relation ${alias} not found`);
    }

    const {
      model,
      localField,
      as,
      foreignField,
      single = false,
      select: selectColumns,
    } = relation.call(this.model);

    const pipeline = [];

    if (selectColumns) {
      pipeline.push(select(selectColumns));
    }

    this.lookup(
      model.collectionName,
      localField || `${as}.id`,
      foreignField || "id",
      as,
      pipeline,
    );

    if (single) {
      this.addPipeline({
        $addFields: {
          [`${as}`]: {
            $first: `$${as}`,
          },
        },
      });
    }

    return this;
  }
}
