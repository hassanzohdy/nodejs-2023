import { Model } from "core/database";
import RepositoryFillerManager from "./repository-filler-manager";

export default abstract class RepositoryManager<
  T extends Model,
  M extends typeof Model = typeof Model,
> extends RepositoryFillerManager<T, M> {
  //
}
