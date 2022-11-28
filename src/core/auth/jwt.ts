import { getServer, request } from "core/http";

const jwt = {
  /**
   * Generate a new JWT token for the user
   */
  async generate(payload: any, options?: any) {
    return getServer().jwt.sign(payload, options);
  },
  /**
   * Verify Current token from request which will be in the `Authorization` header
   */
  async verify() {
    return await request.baseRequest.jwtVerify();
  },
};

export default jwt;
