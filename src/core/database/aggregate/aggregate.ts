import { get } from "@mongez/reinforcements";
import { GenericObject } from "@mongez/reinforcements/cjs/types";
import database from "../database";
import { count, dayOfMonth, month, year } from "./columns";
import DeselectPipeline from "./DeselectPipeline";
import GroupByPipeline from "./GroupByPipeline";
import LimitPipeline from "./LimitPipeline";
import LookupPipeline from "./LookupPipeline";
import OrWherePipeline from "./OrWherePipeline";
import { parsePipelines } from "./parsePipelines";
import Pipeline from "./pipeline";
import SelectPipeline from "./SelectPipeline";
import SkipPipeline from "./SkipPipeline";
import SortByPipeline from "./SortByPipeline";
import SortPipeline from "./SortPipeline";
import UnwindPipeline from "./UnwindPipeline";
import WhereExpressionPipeline from "./WhereExpressionPipeline";
import WherePipeline, { WhereOperator } from "./WherePipeline";

export default class Aggregate {
  /**
   * Collection pipelines
   */
  protected pipelines: Pipeline[] = [];

  /**
   * Constructor
   */
  public constructor(protected readonly collectionName: string) {}

  /**
   * Sort by the given column
   */
  public sort(column: string, direction: "asc" | "desc" = "asc") {
    return this.pipeline(new SortPipeline(column, direction));
  }

  /**
   * @alias sort
   */
  public orderBy(column: string, direction: "asc" | "desc" = "asc") {
    return this.sort(column, direction);
  }

  /**
   * Group by aggregate
   */
  public groupBy(GroupByPipeline: GroupByPipeline): this;
  public groupBy(
    GroupByPipeline: GenericObject,
    groupByData?: GenericObject,
  ): this;
  public groupBy(groupBy_id: string | null, groupByData: GenericObject): this;
  public groupBy(...args: any[]) {
    const [groupBy_id, groupByData] = args;

    if (groupBy_id instanceof GroupByPipeline) {
      return this.pipeline(groupBy_id);
    }

    return this.pipeline(new GroupByPipeline(groupBy_id, groupByData));
  }

  /**
   * Group by year
   */
  public groupByYear(column: string, groupByData?: GenericObject) {
    return this.groupBy(
      {
        ...year(column, "year"),
      },
      groupByData,
    );
  }

  /**
   * Group by month and year
   */
  public groupByMonthAndYear(column: string, groupByData?: GenericObject) {
    return this.groupBy(
      {
        ...year(column, "year"),
        ...month(column, "month"),
      },
      groupByData,
    );
  }

  /**
   * Group by month only
   */
  public groupByMonth(column: string, groupByData?: GenericObject) {
    return this.groupBy(
      {
        ...month(column, "month"),
      },
      groupByData,
    );
  }

  /**
   * Group by day, month and year
   */
  public groupByDate(column: string, groupByData?: GenericObject) {
    return this.groupBy(
      {
        ...year(column, "year"),
        ...month(column, "month"),
        ...dayOfMonth(column, "day"),
      },
      groupByData,
    );
  }

  /**
   * Group by day only
   */
  public groupByDayOfMonth(column: string, groupByData?: GenericObject) {
    return this.groupBy(
      {
        ...dayOfMonth(column, "day"),
      },
      groupByData,
    );
  }

  /**
   * Order by descending
   */
  public orderByDesc(column: string) {
    return this.sort(column, "desc");
  }

  /**
   * Sort by multiple columns
   */
  public sortBy(columns: Record<string, "desc" | "asc">) {
    return this.pipeline(new SortByPipeline(columns));
  }

  /**
   * Limit the number of results
   */
  public limit(limit: number) {
    return this.pipeline(new LimitPipeline(limit));
  }

  /**
   * Skip the given number of results
   */
  public skip(skip: number) {
    return this.pipeline(new SkipPipeline(skip));
  }

  /**
   * Select the given columns
   */
  public select(columns: string[] | Record<string, 0 | 1 | boolean>) {
    return this.pipeline(new SelectPipeline(columns));
  }

  /**
   * Deselect the given columns
   */
  public deselect(columns: string[]) {
    return this.pipeline(new DeselectPipeline(columns));
  }

  /**
   * Unwind/Extract the given column
   */
  public unwind(column: string) {
    return this.pipeline(new UnwindPipeline(column));
  }

  /**
   * Add where pipeline
   */
  public where(column: string, value: any): this;
  public where(column: string, operator: WhereOperator, value: any): this;
  public where(column: GenericObject): this;
  public where(...args: any[]) {
    return this.pipeline(new WherePipeline(...args));
  }

  /**
   * Or Where pipeline
   */
  public orWhere(column: GenericObject) {
    return this.pipeline(new OrWherePipeline(column));
  }

  /**
   * Where null
   */
  public whereNull(column: string) {
    return this.where(column, null);
  }

  /**
   * Where using expression
   */
  public whereExpression(column: string, expression: any) {
    return this.pipeline(new WhereExpressionPipeline(column, expression));
  }

  /**
   * Where not null
   */
  public whereNotNull(column: string) {
    return this.where(column, "!=", null);
  }

  /**
   * Where like operator
   */
  public whereLike(column: string, value: string) {
    return this.where(column, "like", value);
  }

  /**
   * Where not like operator
   */
  public whereNotLike(column: string, value: string) {
    return this.where(column, "notLike", value);
  }

  /**
   * Where between operator
   */
  public whereBetween(column: string, value: [any, any]) {
    return this.where(column, "between", value);
  }

  /**
   * Where date between operator
   */
  public whereDateBetween(column: string, value: [Date, Date]) {
    return this.where(column, "between", value);
  }

  /**
   * Where not between operator
   */
  public whereNotBetween(column: string, value: [any, any]) {
    return this.where(column, "notBetween", value);
  }

  /**
   * Where exists operator
   */
  public whereExists(column: string) {
    return this.where(column, "exists", true);
  }

  /**
   * Where not exists operator
   */
  public whereNotExists(column: string) {
    return this.where(column, "exists", false);
  }

  /**
   * Where size operator
   */
  public whereSize(column: string, size: number) {
    return this.where(column, "size", size);
  }

  /**
   * Where in operator
   */
  public whereIn(column: string, values: any[]) {
    return this.where(column, "in", values);
  }

  /**
   * Where not in operator
   */
  public whereNotIn(column: string, values: any[]) {
    return this.where(column, "notIn", values);
  }

  /**
   * Lookup the given collection
   */
  public lookup(
    collection: string,
    localField: string,
    foreignField: string,
    as: string,
    pipeline?: (Pipeline | GenericObject)[],
  ) {
    return this.pipeline(
      new LookupPipeline(collection, localField, foreignField, as, pipeline),
    );
  }

  /**
   * Get new pipeline instance
   */
  public pipeline(pipeline: Pipeline) {
    this.pipelines.push(pipeline);

    return this;
  }

  /**
   * Add mongodb plain pipeline
   */
  public addPipeline(pipeline: any) {
    this.pipelines.push(pipeline);

    return this;
  }

  /**
   * Add mongodb plain pipelines
   */
  public addPipelines(pipelines: any[]) {
    this.pipelines.push(...pipelines);

    return this;
  }

  /**
   * Get only first result
   */
  public async first(): Promise<any> {
    const results = await this.limit(1).get();

    return results[0];
  }

  /**
   * Get the data
   */
  public async get(mapData?: (data: any) => any): Promise<any[]> {
    const records = await this.execute();

    return mapData ? records.map(mapData) : records;
  }

  /**
   * Execute the query
   */
  public async execute() {
    const collection = database.collection(this.collectionName);

    return await collection.aggregate(this.parse()).toArray();
  }

  /**
   * Count the results
   */
  public async count(): Promise<number> {
    this.groupBy(null, count("total"));

    const results = await this.execute();

    return get(results, "0.total", 0);
  }

  /**
   * Parse pipelines
   */
  public parse() {
    return parsePipelines(this.pipelines);
  }
}
