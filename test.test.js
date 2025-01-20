import { expect, it } from "vitest";

it("should pass", async () => {
  expect(true).toBe(true);

  function x(v) {
    console.log(v);
    return "xxxx:" + v;
  }

  console.log(1);
  const bbb = (
    await async function (v) {
      return x(v);
    }
  )("hello");
  console.log(2, bbb);
});
