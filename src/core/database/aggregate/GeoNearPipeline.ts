import Pipeline from "./pipeline";
import { GeoLocation } from "./types";

export default class GeoNearPipeline extends Pipeline {
  /**
   * Constructor
   */
  public constructor(
    protected readonly column: string,
    protected readonly location: GeoLocation,
    protected readonly maxDistance?: number,
    protected readonly minDistance?: number,
  ) {
    super("geoNear");
  }

  /**
   * {@inheritdoc}
   */
  public parse() {
    return {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [this.location.lng, this.location.lat],
        },
        distanceField: this.column,
        ...(this.maxDistance && { maxDistance: this.maxDistance }),
        ...(this.minDistance && { minDistance: this.minDistance }),
        spherical: true,
        // distance should be calculated in kilometers
        distanceMultiplier: 0.001,
      },
    };
  }

  /**
   * Sort Order
   */
  public sortOrder() {
    return -1;
  }
}
