import dayjs from "dayjs";
import { GeoUtils } from "src/utility/GeoUtils";

export async function modifyRequestParams() {
  $request.headers["Authorization"] = "Bearer 1234567890";
  $request.query.foo = GeoUtils.getRandomInt(1, 100);
  $request.headers["X-Timestamp"] = dayjs().unix();
  $context.foo = "bar";
}

export const modifyRequestParamsHook: ApiHook = {
  id: "reapi-modify-request-params",
  displayName: "Modify Request Params",
  description: "Modify the request params",
  type: "beforeRequest",
  function: modifyRequestParams,
};
