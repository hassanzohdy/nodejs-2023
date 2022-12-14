import { Model } from "core/database";
import Aggregate from "core/database/aggregate/aggregate";
import { request } from "core/http";
import Rule from "./rule";

export default class UniqueRule extends Rule {
  /**
   * Rule name
   */
  public static ruleName = "unique";

  /**
   * Table name
   */
  protected tableName?: string;

  /**
   * Except column
   */
  protected exceptColumn = "id";

  /**
   * Except value
   */
  protected exceptValue: any = null;

  /**
   * Model
   */
  protected model?: typeof Model;

  /**
   * Constructor
   */
  public constructor(
    tableName: string | typeof Model,
    protected columnName?: string,
  ) {
    //
    super();
    if (typeof tableName === "string") {
      this.tableName = tableName;
    } else {
      this.model = tableName;
    }
  }

  /**
   * Except value
   */
  public except(column: string, value?: any) {
    this.exceptColumn = column;
    this.exceptValue = value;

    return this;
  }

  /**
   * Validate the rule
   */
  public async validate() {
    if (this.exceptColumn && !this.exceptValue) {
      this.exceptValue = request.input(this.exceptColumn);
    }

    let query: Aggregate;

    if (this.model) {
      query = (this.model as any).aggregate();
    } else {
      query = new Aggregate(this.tableName as string);
    }

    query.where(this.columnName || this.input, this.value);

    if (this.exceptValue) {
      query.where(this.exceptColumn, "!=", this.exceptValue);
    }

    this.isValid = (await query.count()) === 0;
  }

  /**
   * Get error message
   */
  public error() {
    return `${this.input} is required`;
  }
}
