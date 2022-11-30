import httpUtil from "../utils/httpUtil";

/**
 * 文件
 */
export function uploadImage(params, headers) {
  return httpUtil.postWithHeaders("api/file/upload_image", params, headers);
}
