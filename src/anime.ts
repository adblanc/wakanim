import cheerio from "cheerio";
import fetch from "node-fetch";
import { baseUrl } from "./shared/config";

const IMG_SELECTOR =
  "body > div.SerieV2 > section > div.container > div > div.SerieV2-header.SerieHeader.clearfix > div.SerieHeader-left > img";

const SYNOPSIS_SELECTOR =
  "#container-sub > div > ul > li.border-list_item.--morePadding > span";

interface AnimeInfos {
  img: string;
  synopsis: string;
  date: string;
  originalName: string;
  otherNames: string;
  classification: string;
  genres: string[];
  copyright: string;
  followedBy: string;
  keywords: string[];
  ref: "wakanim";
}

async function requestAnime(url: string) {
  url = encodeURI(url);

  const res = await fetch(url);

  return res.text();
}

const getDiffusionDate = ($: CheerioStatic, elem: CheerioElement) => {
  let date = "";
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
  return date;
};

const getContent = (elem: Cheerio) => elem.find("span.border-list_text").text();

const getKeywords = ($: CheerioStatic, elem: CheerioElement) => {
  return $(elem)
    .find("span.border-list_text > a")
    .map((i, e) => {
      return {
        name: e.attribs["title"].trim(),
        link: baseUrl + e.attribs["href"],
      };
    })
    .get();
};

export const getAnimeInfos = async (url: string) => {
  const html = await requestAnime(url);
  const $ = cheerio.load(html);
  const result: AnimeInfos = {
    img: `https:${$(IMG_SELECTOR).attr("src")}`,
    synopsis: $(SYNOPSIS_SELECTOR).text(),
    date: "",
    originalName: "",
    otherNames: "",
    classification: "",
    genres: [],
    copyright: "",
    followedBy: "",
    keywords: [],
    ref: "wakanim",
  };
  $("#container-sub > div > ul > li").each((i, elem) => {
    if ($(elem).find("span.border-list_title"))
      switch ($(elem).find("span.border-list_title").text()) {
        case "Date de diffusion":
          result.date = getDiffusionDate($, elem);
          break;
        case "Nom original":
          result.originalName = getContent($(elem));
          break;
        case "Autres noms":
          result.otherNames = getContent($(elem));
          break;
        case "Classification":
          result.classification = getContent($(elem));
          break;
        case "Genres":
          $(elem)
            .find("span.border-list_text > a")
            .each((i, g) => {
              if (g) result.genres.push($(g).text());
            });
          break;
        case "Copyright":
          result.copyright = getContent($(elem));
          break;
        case "Suivi par":
          result.followedBy = getContent($(elem));
        case "Mots-clés":
          result.keywords = getKeywords($, elem);
      }
  });
  return result;
};
