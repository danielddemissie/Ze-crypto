const Composer = require('telegraf/composer');
const session = require('telegraf/session');

require('dotenv').config();

const { getTop10List, getPriceOfTopCoins } = require('./src/topCoins');
const {
  coinListForPrice,
  morePriceList,
  getPriceOfChoosedCoin,
} = require('./src/price');
const {
  moreWatchList,
  myWatchList,
  startWatchingCoin,
  stopWatchingCoin,
  toWatchList,
} = require('./src/watchCoin');
const { priceArr, watchArr } = require('./src/coinListArr');
const startBot = require('./src/start');

//keys
const API_KEY = process.env.API_KEY;

let top10Coins = [];
let scale = 5;
let symbol;
let followList = {};
let shouldStop = false;

const bot = new Composer();
bot.use(session());

//start bot
startBot(bot);

//Price Section
coinListForPrice(bot);
morePriceList(bot);
getPriceOfChoosedCoin(bot, symbol, priceArr, API_KEY);

// toplist
getTop10List(bot, top10Coins, API_KEY);
getPriceOfTopCoins(bot, top10Coins, API_KEY);

//watching
toWatchList(bot);
moreWatchList(bot);
startWatchingCoin(bot, symbol, watchArr, followList, scale, API_KEY);
myWatchList(bot, followList);
stopWatchingCoin(bot, shouldStop, followList);

module.exports = bot;
