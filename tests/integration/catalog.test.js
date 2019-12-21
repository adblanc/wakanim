const wakanim = require("../../index");

describe("catalog", () => {
  it("should return catalog", async () => {
    const catalog = await wakanim.getCatalog();
    catalog.forEach(anime => {
      expect(Object.keys(anime)).toEqual(
        expect.arrayContaining([
          "name",
          "link",
          "year",
          "rating",
          "type",
          "episodes",
          "season"
        ])
      );
    });
  });
});
