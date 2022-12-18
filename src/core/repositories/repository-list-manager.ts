import { get } from "@mongez/reinforcements";
import {
  Model,
  PaginationListing,
  WhereOperator,
  whereOperators,
} from "core/database";
import ModelAggregate from "core/database/model/ModelAggregate";
import dayjs from "dayjs";
import BaseRepositoryManager from "./base-repository-manager";
import {
  FilterByOption,
  FilterByOptions,
  FilterOptionType,
  RepositoryOptions,
} from "./types";
import { defaultRepositoryOptions } from "./utils";

const MissingOption = Symbol("MissingOption");

export default abstract class RepositoryListManager<
  T extends Model,
  M extends typeof Model = typeof Model,
> extends BaseRepositoryManager<T, M> {
  /**
   * Aggregate query
   */
  protected query?: ModelAggregate<T>;

  /**
   * List default options
   */
  protected defaultOptions: RepositoryOptions = { ...defaultRepositoryOptions };

  /**
   * List options
   */
  protected options: RepositoryOptions = {};

  /**
   * Pagination info
   *
   * Returned when the list is paginated
   */
  public paginationInfo?: PaginationListing<T>["paginationInfo"];

  /**
   * Filter By options
   */
  protected filterBy: FilterByOptions = {};

  /**
   * Before listing
   * Called before listing records
   */
  protected async beforeListing() {
    // override this method
  }

  /**
   * On list
   * Called after listing records
   */
  protected async onList(records: T[]): Promise<T[]> {
    return records;
  }

  /**
   * List records
   */
  public async list(options?: RepositoryOptions) {
    this.prepareOptions(options);

    const Model = this.model;

    this.query = (Model as any).aggregate();

    if (!this.query) return [];

    await this.beforeListing();

    this.parseFilterBy();

    this.filter();

    this.orderBy();

    if (this.options.select) {
      this.query.select(this.options.select);
    }

    let records: T[] = [];

    if (this.options.limit) {
      if (!this.options.paginate) {
        this.query.limit(this.options.limit);

        records = await this.query.get();
      } else {
        const { documents, paginationInfo } = await this.query.paginate(
          this.options.page || 1,
          this.options.limit,
        );

        records = documents;

        this.paginationInfo = paginationInfo;
      }
    }

    records = await this.onList(records);

    return records;
  }

  /**
   * Get first record
   */
  public async first(options?: RepositoryOptions) {
    const records = await this.list({
      orderBy: ["id", "asc"],
      ...options,
      limit: 1,
    });

    return records[0];
  }

  /**
   * Get last record
   */
  public async last(options?: RepositoryOptions) {
    const records = await this.list({
      orderBy: ["id", "desc"],
      ...options,
      limit: 1,
    });

    return records[0];
  }

  /**
   * Prepare options
   */
  protected prepareOptions(options: RepositoryOptions = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
  }

  /**
   * Parse filter by
   */
  protected parseFilterBy() {
    // get where operators from WhereOperator type
    for (const filterType in this.filterBy) {
      // where operators
      this.whenFilterType(
        filterType as FilterOptionType,
        whereOperators.includes(filterType as WhereOperator),
        (column, value) => {
          this.query?.where(column, filterType as WhereOperator, value);
        },
      );

      // bool, boolean
      this.whenFilterType(
        filterType as FilterOptionType,
        ["bool", "boolean"].includes(filterType),
        (column, value) => this.query?.where(column, Boolean(value)),
      );

      // int, integer
      this.whenFilterType(
        filterType as FilterOptionType,
        ["int", "integer"].includes(filterType),
        (column, value) => this.query?.where(column, parseInt(value)),
      );

      // inInt
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "inInt",
        (column, value) =>
          this.query?.whereIn(
            column,
            value.map((v: any) => parseInt(v)),
          ),
      );

      // number
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "number",
        (column, value) => this.query?.where(column, Number(value)),
      );

      // inNumber
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "inNumber",
        (column, value) =>
          this.query?.whereIn(
            column,
            value.map((v: any) => Number(v)),
          ),
      );

      // float, double
      this.whenFilterType(
        filterType as FilterOptionType,
        ["float", "double"].includes(filterType),
        (column, value) => this.query?.where(column, parseFloat(value)),
      );

      // inFloat
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "inFloat",
        (column, value) =>
          this.query?.whereIn(
            column,
            value.map((v: any) => parseFloat(v)),
          ),
      );

      // date
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "date",
        (column, value) => this.query?.where(column, this.parseDate(value)),
      );

      // date>
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "date>",
        (column, value) =>
          this.query?.where(column, ">", this.parseDate(value)),
      );

      // date>=
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "date>=",
        (column, value) =>
          this.query?.where(column, ">=", this.parseDate(value)),
      );

      // date<
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "date<",
        (column, value) =>
          this.query?.where(column, "<", this.parseDate(value)),
      );

      // date<=
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "date<=",
        (column, value) =>
          this.query?.where(column, "<=", this.parseDate(value)),
      );

      // inDate
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "inDate",
        (column, value) =>
          this.query?.whereIn(column, value.map(this.parseDate.bind(this))),
      );

      // dateBetween
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateBetween",
        (column, value) => {
          const [from, to] = value;

          this.query?.whereBetween(column, [
            this.parseDate(from),
            this.parseDate(to),
          ]);
        },
      );

      // dateTime
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTime",
        (column, value) =>
          this.query?.where(column, this.parseDate(value, this.dateTimeFormat)),
      );

      // dateTime>
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTime>",
        (column, value) =>
          this.query?.where(
            column,
            ">",
            this.parseDate(value, this.dateTimeFormat),
          ),
      );

      // dateTime>=
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTime>=",
        (column, value) =>
          this.query?.where(
            column,
            ">=",
            this.parseDate(value, this.dateTimeFormat),
          ),
      );

      // dateTime<
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTime<",
        (column, value) =>
          this.query?.where(
            column,
            "<",
            this.parseDate(value, this.dateTimeFormat),
          ),
      );

      // dateTime<=
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTime<=",
        (column, value) =>
          this.query?.where(
            column,
            "<=",
            this.parseDate(value, this.dateTimeFormat),
          ),
      );

      // inDateTime
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "inDateTime",
        (column, value) =>
          this.query?.whereIn(
            column,
            value.map((v: any) => this.parseDate(v, this.dateTimeFormat)),
          ),
      );

      // dateTimeBetween
      this.whenFilterType(
        filterType as FilterOptionType,
        filterType === "dateTimeBetween",
        (column, value) => {
          const [from, to] = value;

          this.query?.whereBetween(column, [
            this.parseDate(from, this.dateTimeFormat),
            this.parseDate(to, this.dateTimeFormat),
          ]);
        },
      );
    }
  }

  /**
   * Parse date value
   */
  protected parseDate(value: any, format = this.dateFormat) {
    if (value instanceof Date) return value;

    if (typeof value === "string") {
      return dayjs(value, format);
    }

    return value;
  }

  /**
   * When filter type is equal to the given type
   */
  protected whenFilterType(
    filterType: FilterOptionType,
    condition: boolean,
    callback: (column: string, value: any) => void,
  ) {
    if (!condition) return;

    const options = this.filterBy[filterType];

    if (!options) return;

    for (const option of options) {
      const { column, value } = this.parseOption(option);

      if (value === MissingOption) continue;

      callback(column, value);
    }
  }

  /**
   * Parse the given option and return the column name and the value
   */
  protected parseOption(option: FilterByOption) {
    const column = typeof option === "string" ? option : option.column;
    const optionKey = typeof option === "string" ? option : option.option;

    const value = this.option(optionKey);

    return { column, value } as {
      column: string;
      value: any;
    };
  }

  /**
   * Get option's value for the given key
   */
  protected option(key: string, defaultValue: any = MissingOption) {
    return get(this.options, key, defaultValue);
  }

  /**
   * Make filter
   */
  protected filter() {
    //
  }

  /**
   * Make order by
   */
  protected orderBy() {
    if (!this.options.orderBy) return;

    const [column, direction] = this.options.orderBy;

    this.query?.orderBy(column, direction);
  }

  /**
   * Find By id
   */
  public async find(id: string | number | T): Promise<null | T> {
    if (id instanceof this.model) return id as T;

    return await this.findBy("id", Number(id));
  }

  /**
   * Find by the given column
   */
  public async findBy(column: string, value: any): Promise<null | T> {
    return await (this.model as any).findBy(column, value);
  }
}
