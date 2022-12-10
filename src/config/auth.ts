import User from "app/users/models/user/user";
import Guest from "core/auth/models/guest";

const authConfigurations = {
  userType: {
    guest: Guest,
    user: User,
  },
};

export default authConfigurations;
