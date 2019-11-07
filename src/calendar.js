const cheerio = require("cheerio");
const fetch = require("node-fetch");

//Rajouter securite interval startDate avant endDate et intervalle max
// 2 semaines !!!
function requestCalendar(startDate, endDate, free = false) {
  const url = `https://www.wakanim.tv/fr/v2/agenda/getevents?s=${startDate}&e=${endDate}&free=${free}`;
  return fetch(url)
    .then(response => response.text())
    .catch(error =>
      console.error(`Error while fetching wakanim calendar : ${error}`)
    );
}

async function getCalendar(startDate, endDate, free = false) {
  try {
    const calendar = await requestCalendar(startDate, endDate, free);
    const $ = cheerio.load(calendar);
    const days = $(".Calendar-col")
      .map((i, elem) => {
        const eps = $(elem)
          .find(".Calendar-ep")
          .map((i, e) => {
            return {
              hour: $(e)
                .find(".Calendar-hourTxt")
                .first()
                .text(),
              name: $(e)
                .find(".Calendar-epTitle")
                .first()
                .text(),
              link: $(e)
                .find(".Calendar-epTitle")
                .first()
                .attr("href"),
              img: `https://wakanim.tv${$(e)
                .find(".Calendar-linkImg")
                .first()
                .attr("href")}`
            };
          })
          .get();
        return {
          date: $(elem)
            .find(".Calendar-day")
            .first()
            .text()
            .trim(),
          eps
        };
      })
      .get();
    return days;
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = getCalendar;
