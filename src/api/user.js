import httpUtil from "../utils/httpUtil";

/**
 * 用户
 */
export function updateUser(params) {
  return httpUtil.post("api/user/update_user", params);
}

export function findUser(params) {
  return httpUtil.get("api/user/find_user", params);
}
