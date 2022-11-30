import httpUtil from "../utils/httpUtil";

/**
 * 登录
 */
export function doLogin(params) {
  return httpUtil.post("api/login/do_login", params);
}

export function applyRegister(params) {
  return httpUtil.post("api/login/apply_register", params);
}

export function activeUser(params) {
  return httpUtil.post("api/login/active_user", params);
}

export function resetPass(params) {
  return httpUtil.post("api/login/reset_password", params);
}

export function activeResetPass(params) {
  return httpUtil.post("api/login/active_reset_password", params);
}
