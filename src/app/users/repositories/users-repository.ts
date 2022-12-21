import { RepositoryManager } from "core/repositories";
import { User } from "../models/user";

export class UsersRepository extends RepositoryManager<User> {
  /**
   * {@inheritDoc}
   */
  public model = User;
}

const usersRepository = new UsersRepository();

export default usersRepository;
