import * as wakanim from "../../src/index";

describe("catalog", () => {
  it("should return catalog", async () => {
    const catalog = await wakanim.getCatalog();
    catalog.forEach((anime) => {
      expect(anime.episodes).toBeGreaterThanOrEqual(0);
      expect(anime.season).toBeGreaterThanOrEqual(0);
      expect(Object.keys(anime)).toEqual(
        expect.arrayContaining([
          "name",
          "link",
          "year",
          "rating",
          "type",
          "episodes",
          "season",
        ])
      );
    });
  });
});
