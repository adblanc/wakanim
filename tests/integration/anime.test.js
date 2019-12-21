const wakanim = require("../../index");

describe("anime infos", () => {
  it("should return anime informations", async () => {
    const url = "https://www.wakanim.tv/fr/v2/catalogue/show/180/acca";
    const infos = await wakanim.getAnimeInfos(url);
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
        "extraInfos",
        "ref"
      ])
    );
    expect(infos.ref).toMatch("wakanim");
  });
});
