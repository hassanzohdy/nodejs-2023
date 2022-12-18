import { get, set, unset } from "@mongez/reinforcements";
import { GenericObject } from "@mongez/reinforcements/cjs/types";
import Is from "@mongez/supportive-is";
import { Model } from "core/database";
import { assetsUrl, uploadsUrl, url } from "core/utils/urls";
import dayjs from "dayjs";
import { ResourceData, ResourceOutput } from "./types";

const missingKey = Symbol("missing");

export default class Resource {
  /**
   * Final data output
   */
  protected data: GenericObject = {};

  /**
   * Disabled keys from being returned in the final output
   */
  protected static disabledKeys: string[] = [];

  /**
   * The only allowed keys
   */
  protected static allowedKeys: string[] = [];

  /**
   * Output shape
   */
  protected output: ResourceOutput = {};

  /**
   * Defaults when key is missing from the given data
   */
  protected defaults = {};

  /**
   * Default date format
   */
  protected dateFormat = "DD-MM-YYYY HH:mm:ss";

  /**
   * Constructor
   */
  public constructor(protected resource: ResourceData = {}) {
    //
    if (this.resource instanceof Model) {
      this.resource = this.resource.data;
    } else if (this.resource instanceof Resource) {
      this.resource = this.resource.resource;
    }
  }

  /**
   * return list of resources for the given array ouf data
   */
  public static collect(data: ResourceData[]) {
    return data.map(item => {
      return new this(item);
    });
  }

  /**
   * Set value to the final output
   */
  public set(key: string, value: any) {
    set(this.data, key, value);

    return this;
  }

  /**
   * Get value from final output
   */
  public get(key: string, defaultValue = null) {
    return get(this.resource, key, defaultValue);
  }

  /**
   * Remove a key from the final output
   */
  public remove(...keys: string[]) {
    unset(this.data, keys);
  }

  /**
   * Disable the given keys
   */
  public static disable(...keys: string[]) {
    this.disabledKeys.push(...keys);

    return this;
  }

  /**
   * Allow only the given keys
   */
  public static allow(...keys: string[]) {
    this.allowedKeys.push(...keys);

    return this;
  }

  /**
   * Get final output data
   */
  public get response() {
    return this.toJSON();
  }

  /**
   * Boot method
   * Called before transforming the resource
   */
  protected async boot() {
    //
  }

  /**
   * Extend the resource output
   * Called after transforming the resource
   */
  protected async extend() {
    //
  }

  /**
   * Transform resource to object, that's going to be used as the final output
   */
  public async toJSON() {
    await this.boot();

    await this.transformOutput();

    await this.extend();

    return this.data;
  }

  /**
   * Transform final output
   */
  protected async transformOutput() {
    for (const key in this.output) {
      // first check if key is disabled
      if (this.isDisabledKey(key)) continue;

      if (!this.isAllowedKey(key)) continue;

      // get value type
      const valueType = this.output[key];

      // now get the value from the given resource data
      const value = get(
        this.resource,
        key,
        get(this.defaults, key, missingKey),
      );

      if (value === missingKey) {
        continue;
      }

      if (Is.object(value)) {
        if (!Is.plainObject(value) && !Is.empty(value)) {
          continue;
        }
      } else if (Is.empty(value)) continue;

      if (Array.isArray(value)) {
        set(
          this.data,
          key,
          value.map(async item => await this.transformValue(item, valueType)),
        );
      } else {
        set(this.data, key, await this.transformValue(value, valueType));
      }
    }
  }

  /**
   * Check if the given value is valid resource value
   */
  protected isValidResourceValue(value: any) {
    return (
      (Is.plainObject(value) && !Is.empty(value)) ||
      value instanceof Resource ||
      value instanceof Model
    );
  }

  /**
   * Check if the given key is disabled
   */
  protected isDisabledKey(key: string) {
    return (this.constructor as typeof Resource).disabledKeys.includes(key);
  }

  /**
   * Check if the given key is allowed
   */
  protected isAllowedKey(key: string) {
    const allowedKeys = (this.constructor as typeof Resource).allowedKeys;
    return allowedKeys.length === 0 || allowedKeys.includes(key);
  }

  /**
   * Transform value
   */
  protected async transformValue(value: any, valueType: any) {
    if (typeof valueType === "string") {
      value = this.cast(value, valueType);
    } else if (valueType.prototype instanceof Resource) {
      // if value is not a valid resource value then return null
      if (!this.isValidResourceValue(value)) return null;

      value = new valueType(value);
    } else if (typeof valueType === "function") {
      value = await valueType.call(this, value);
    }

    return value;
  }

  /**
   * Builtin casts
   */
  protected cast(value: any, type: string) {
    switch (type) {
      case "number":
        return Number(value);
      case "float":
      case "double":
        return parseFloat(value);
      case "integer":
        return parseInt(value);
      case "string":
        return String(value);
      case "boolean":
        return Boolean(value);
      case "date":
        return {
          format: dayjs(value).format(this.dateFormat),
          timestamp: dayjs(value).unix(),
          human: dayjs(value).fromNow(),
          text: new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(value),
        };
      case "url":
        return url(value);
      case "uploadsUrl":
        return uploadsUrl(value);
      case "assetsUrl":
        return assetsUrl(value);
      default:
        return value;
    }
  }
}
