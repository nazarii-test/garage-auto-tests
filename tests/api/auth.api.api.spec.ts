import { test, expect } from "@playwright/test";
import { testUser1 } from "../../test-data/validUsers";

test.describe("Auth", () => {
  test("Sign In", async ({ request }) => {
    const response = await request.post("/api/auth/signin", {
      data: {
        email: testUser1.email,
        password: testUser1.password,
      },
    });
    const sid = response.headers()["set-cookie"].split(";")[0];
    expect(response.status()).toBe(200);
    expect(sid).toContain("sid=");
  });
});
