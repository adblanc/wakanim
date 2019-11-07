# Wakanim scrapper
![package](https://img.shields.io/npm/v/@ablanc/wakanim)<br/>

## Description
Node.js module to scrap content of wakanim.tv and get it as json.

## Installation
`$ npm install @ablanc/wakanim --save`

## Examples

```javascript
const wakanim = require("@ablanc/wakanim");

const catalog = await wakanim.getCatalog();
const infos = await wakanim.getAnimeInfos(catalog[0].link);
// 2 weeks interval at most.
const calendar = await getCalendar(11-11-2019, 17-11-2019, false);
```

