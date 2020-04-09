import cheerio from "cheerio";
import fetch from "node-fetch";
import { baseUrl } from "./shared/config";

interface CalendarArg {
  startDate: string;
  endDate: string;
  free?: boolean;
}

interface Episode {
  hour: string;
  title: string;
  number: number;
  link: string;
  image: string;
  language: string;
  ref: "wakanim";
}

interface CalendarDay {
  episodes: Episode[];
  date: string;
}

async function requestCalendar({ startDate, endDate, free }: CalendarArg) {
  const url = `https://www.wakanim.tv/fr/v2/agenda/getevents?s=${startDate}&e=${endDate}&free=${
    free ? free : "false"
  }`;
  const res = await fetch(url);

  return res.text();
}

const formatEpisodeHour = (episode: Episode) => {
  let time = episode.hour.split(":");
  let hour = parseInt(time[0]);

  hour += 1;
  time[0] = hour.toString();

  episode.hour = time.join(":");
};

export const getCalendar = async (
  data: CalendarArg
): Promise<CalendarDay[]> => {
  const calendar = await requestCalendar(data);
  const $ = cheerio.load(calendar);

  const days: CalendarDay[] = $(".Calendar-col")
    .map((i, elem) => {
      const eps = $(elem)
        .find(".Calendar-ep")
        .map((i, e) => {
          const number = $(e).find(".Calendar-epNumber").first().text();
          return {
            hour: $(e).find(".Calendar-hourTxt").first().text(),
            title: $(e).find(".Calendar-epTitle").first().text(),
            number: parseInt(
              number.startsWith("0") ? number.substring(1) : number
            ),
            link: `${baseUrl}${$(e)
              .find(".Calendar-linkImg")
              .first()
              .attr("href")}`,
            image: `https:${$(e).find(".Calendar-image").first().attr("src")}`,
            language: $(e).find(".Calendar-tagTranslation").first().text(),
            ref: "wakanim",
          };
        })
        .get();
      return {
        date: $(elem).find(".Calendar-day").first().text().trim(),
        episodes: eps,
      };
    })
    .get();
  days.forEach(({ episodes }) => {
    episodes.forEach((episode) => {
      formatEpisodeHour(episode);
    });
  });
  return days;
};
