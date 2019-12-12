const cheerio = require("cheerio");
const fetch = require("node-fetch");

function requestCatalog() {
  const url = `https://www.wakanim.tv/fr/v2/catalogue`;
  return fetch(url)
    .then(response => response.text())
    .catch(error =>
      console.error(`Error while fetching wakanim calendar : ${error}`)
    );
}

async function getCatalog() {
  try {
    const html = await requestCatalog();
    const $ = cheerio.load(html);
    const catalog = $(
      "body > section.catalog.has-grid.js-layout.js-catalog > div > div > div.catalog_main > ul > li"
    )
      .map((i, elem) => {
        return {
          name: $(elem)
            .find("div > div.slider_item_description > span > strong")
            .text(),
          link: `https://www.wakanim.tv${$(elem)
            .find("div > a")
            .attr("href")}`,
          year: $(elem).attr("data-year"),
          rating: parseFloat(
            $(elem)
              .attr("data-rating")
              .replace(",", ".")
          ),
          type: $(elem).attr("data-type"),
          episodes: parseInt(
            $(elem)
              .find(
                "div > div.list-view.tooltip.js-tooltip > p.tooltip_text > strong"
              )
              .text()
          ),
          season: parseInt(
            $(elem)
              .find("div > div.list-view.tooltip.js-tooltip > span")
              .text()
          )
        };
      })
      .get();
    return catalog;
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = getCatalog;
