const cheerio = require("cheerio");
const fetch = require("node-fetch");

const IMG_SELECTOR =
  "body > div.SerieV2 > section > div.container > div > div.SerieV2-header.SerieHeader.clearfix > div.SerieHeader-left > img";

const SYNOPSIS_SELECTOR =
  "#container-sub > div > ul > li.border-list_item.--morePadding > span";
function requestAnime(url) {
  url = encodeURI(url);
  return fetch(url)
    .then(response => response.text())
    .catch(error =>
      console.error(`Error while fetching wakanim anime page : ${error}`)
    );
}

async function getAnimeInfos(url) {
  try {
    const html = await requestAnime(url);
    const $ = cheerio.load(html);
    let img = `https:${$(IMG_SELECTOR).attr("src")}`;
    let synopsis = $(SYNOPSIS_SELECTOR).text();
    let date = "";
    let originalName = "";
    let genres = [];
    let copyright = "";
    let classification = "";
    let otherNames = "";
    let followedBy = "";
    let extraInfos = "";
    $("#container-sub > div > ul > li").each((i, elem) => {
      if ($(elem).find("span.border-list_title"))
        switch (
          $(elem)
            .find("span.border-list_title")
            .text()
        ) {
          case "Date de diffusion":
            $(elem)
              .find("span.border-list_text > span")
              .each((i, digit) => {
                if ($(digit)) {
                  const text = $(digit).text();
                  date = date.concat(
                    text.length == 1 ? `0${text}` : text,
                    i != 2 ? "/" : ""
                  );
                }
              });
            break;
          case "Nom original":
            originalName = $(elem).find("span.border-list_text");
            if (originalName) originalName = $(originalName).text();
            break;
          case "Autres noms":
            otherNames = $(elem).find("span.border-list_text");
            if (otherNames) otherNames = $(otherNames).text();
            break;
          case "Classification":
            classification = $(elem)
              .find("span.border-list_text")
              .text();
            if (classification) classification = $(classification).text();
            break;
          case "Genres":
            $(elem)
              .find("span.border-list_text > a")
              .each((i, g) => {
                if (g) genres.push($(g).text());
              });
            break;
          case "Copyright":
            copyright = $(elem).find("span.border-list_text");
            if (copyright) copyright = copyright.text();
            break;
          case "Suivi par":
            followedBy = $(elem).find("span.border-list_text");
            if (followedBy) followedBy = $(followedBy).text();
          default:
            extraInfos = $(elem).find("span.border-list_title");
            if (extraInfos) extraInfos = $(extraInfos).text();
            break;
        }
    });
    const result = {
      img,
      synopsis,
      date,
      originalName,
      otherNames,
      classification,
      genres,
      copyright,
      followedBy,
      extraInfos,
      ref: "wakanim"
    };
    return result;
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = getAnimeInfos;
