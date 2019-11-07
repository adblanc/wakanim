const fs = require("fs").promises;

const wakanim = require("../index.js");

async function start() {
  console.time("animes");
  const catalog = await wakanim.getCatalog();
  const animes = [];
  for await (let anime of catalog) {
    animes.push({ ...anime, ...(await wakanim.getAnimeInfos(anime.link)) });
    console.log("push");
  }
  await fs.writeFile("./animes.json", JSON.stringify(animes));
  console.log(`Animes.json mis a jour avec ${animes.length} animes!`);
  console.timeEnd("animes");
}

start();
