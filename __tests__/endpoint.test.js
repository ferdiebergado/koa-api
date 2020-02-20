const request = require("supertest");
const app = require("../src/server");

afterEach(() => {
  app.close();
});

describe("Route tests", () => {
  describe("Root Endpoint", () => {
    test("should output json", async () => {
      const response = await request(app)
        .get("/")
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body.message).toMatch("API Endpoint");
    });
  });
});
