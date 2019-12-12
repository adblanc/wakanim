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
            const number = $(e)
              .find(".Calendar-epNumber")
              .first()
              .text();
            return {
              hour: $(e)
                .find(".Calendar-hourTxt")
                .first()
                .text(),
              title: $(e)
                .find(".Calendar-epTitle")
                .first()
                .text(),
              number: parseInt(
                number.startsWith("0") ? number.substring(1) : number
              ),
              link: `https://wakanim.tv${$(e)
                .find(".Calendar-linkImg")
                .first()
                .attr("href")}`,
              image: `https:${$(e)
                .find(".Calendar-image")
                .first()
                .attr("src")}`,
              language: $(e)
                .find(".Calendar-tagTranslation")
                .first()
                .text(),
              ref: "wakanim"
            };
          })
          .get();
        return {
          date: $(elem)
            .find(".Calendar-day")
            .first()
            .text()
            .trim(),
          episodes: eps
        };
      })
      .get();
    days.forEach(({ episodes }) => {
      episodes.forEach(anime => {
        let time = anime.hour.split(":");
        let hour = parseInt(time[0]);
        hour += 1;
        time[0] = hour.toString();
        anime.hour = time.join(":");
      });
    });
    return days;
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = getCalendar;
