import cheerio from "cheerio";
import fetch from "node-fetch";
import { baseUrl, catalogueUrl } from "./shared/config";

interface Episode {
  name: string;
  link: string;
  year: string;
  rating: number;
  type: string;
  episodes: number;
  season: number;
}

async function requestCatalog(): Promise<string> {
  const url = catalogueUrl;
  const res = await fetch(url);
  return res.text();
}

const getRating = ($: Cheerio) => {
  const ratingString = $.attr("data-rating");

  return ratingString ? parseFloat(ratingString.replace(",", ".")) : 0;
};

export const getCatalog = async (): Promise<Episode[]> => {
  const html = await requestCatalog();
  const $ = cheerio.load(html);
  const catalog = $(
    "body > section.catalog.has-grid.js-layout.js-catalog > div > div > div.catalog_main > ul > li"
  )
    .map((i, elem) => {
      return {
        name: $(elem)
          .find("div > div.list-view.tooltip.js-tooltip > p.tooltip_title")
          .text(),
        link: `${baseUrl}${$(elem).find("div > a").attr("href")}`,
        year: $(elem).attr("data-year"),
        rating: getRating($(elem)),
        type: $(elem).attr("data-type"),
        episodes: parseInt(
          $(elem)
            .find(
              "div > div.list-view.tooltip.js-tooltip > p.tooltip_text > strong"
            )
            .text()
        ),
        season: parseInt(
          $(elem).find("div > div.list-view.tooltip.js-tooltip > span").text()
        ),
      };
    })
    .get();
  return catalog;
};
