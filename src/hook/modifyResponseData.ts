export async function modifyResponseData() {
  if ($response.data) {
    $response.data.foo = $context.foo;
  }
  $context.bar = "foo";
}

export const modifyResponseDataHook: ApiHook = {
  id: "reapi-modify-response-data",
  displayName: "Modify Response Data",
  description: "Modify the response data",
  type: "afterRequest",
  function: modifyResponseData,
};
