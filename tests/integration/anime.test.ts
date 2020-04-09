import * as wakanim from "../../src/index";

jest.setTimeout(30000);

describe("anime infos", () => {
  it("should return anime informations", async () => {
    const list = await wakanim.getCatalog();
    list.length = 10;

    for (let anime of list) {
      const infos = await wakanim.getAnimeInfos(anime.link);
      expect(Object.keys(infos)).toEqual(
        expect.arrayContaining([
          "img",
          "synopsis",
          "date",
          "originalName",
          "otherNames",
          "classification",
          "genres",
          "copyright",
          "followedBy",
          "keywords",
          "ref",
        ])
      );
      expect(infos.ref).toMatch("wakanim");
    }
  });
});
