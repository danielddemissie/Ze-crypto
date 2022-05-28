const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
let top10Coins = [];
let scale = 5;
let symbol;
let followList = {};
let shouldStop = false;

const bot = new Composer();

bot.use(session());

bot.start((ctx) => {
  let username = ctx.update.message.from.first_name;
  ctx.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${username}.Welcome to ዘCrypto`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Show Prices', callback_data: 'price' },
            { text: 'Watch Crypto', callback_data: 'follow' },
          ],
          [
            { text: 'Top 10', callback_data: 'T-list' },
            { text: 'My Watch List', callback_data: 'F-list' },
          ],
        ],
      },
    }
  );
});

// //For getting price
bot.action('price', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, `Choose a Crypto To know the Price`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Etheruim ⟠', callback_data: 'P_ETH' },
          { text: 'Bit Coin ₿', callback_data: 'P_BTC' },
        ],

        [
          { text: ' XRP ✕', callback_data: 'P_XRP' },
          { text: 'Dogecoin Ð', callback_data: 'P_DOGE' },
        ],
        [{ text: '>', callback_data: 'P_more-coin' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});
//more coin for price
bot.action('P_more-coin', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Choose a Crypto To know the Price.', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Tether ₮', callback_data: 'P_USDT' },
          { text: 'Cardano ₳', callback_data: 'P_ADA' },
        ],

        [
          { text: 'Litecoin Ł', callback_data: 'P_LTC' },
          { text: 'Filecoin ⨎', callback_data: 'P_FIL' },
        ],
        [{ text: '<', callback_data: 'price' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

// toplist

bot.action('T-list', async (ctx) => {
  try {
    let res = await axios.get(
      `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=${API_KEY}`
    );
    let coinData = res.data.Data;
    coinData.forEach((item, index, arr) => {
      top10Coins[index] = item;
    });
    ctx.telegram.sendMessage(
      ctx.chat.id,
      '10 Popular Coin List in past 24 hour.',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `${1}.${coinData[0].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[0].CoinInfo.FullName
                }`,
                callback_data: '0',
              },
              {
                text: `${2}.${coinData[1].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[1].CoinInfo.FullName
                }`,
                callback_data: '1',
              },
            ],

            [
              {
                text: `${3}.${coinData[2].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[2].CoinInfo.FullName
                }`,
                callback_data: '2',
              },
              {
                text: `${4}.${coinData[3].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[3].CoinInfo.FullName
                }`,
                callback_data: '3',
              },
            ],
            [
              {
                text: `${5}.${coinData[4].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[4].CoinInfo.FullName
                }`,
                callback_data: '4',
              },
              {
                text: `${6}.${coinData[5].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[5].CoinInfo.FullName
                }`,
                callback_data: '5',
              },
            ],
            [
              {
                text: `${7}.${coinData[6].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[6].CoinInfo.FullName
                }`,
                callback_data: '6',
              },
              {
                text: `${8}.${coinData[7].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[7].CoinInfo.FullName
                }`,
                callback_data: '7',
              },
            ],
            [
              {
                text: `${9}.${coinData[8].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[8].CoinInfo.FullName
                }`,
                callback_data: '8',
              },
              {
                text: `${10}.${coinData[9].DISPLAY.USD.FROMSYMBOL}, ${
                  coinData[9].CoinInfo.FullName
                }`,
                callback_data: '9',
              },
            ],
            [{ text: 'Back', callback_data: 'back-to-menu' }],
          ],
        },
      }
    );
    ctx.answerCbQuery();
  } catch (error) {
    console.log(error);
    ctx.answerCbQuery();
  }
});

bot.action(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], async (ctx) => {
  try {
    let targetCoinIndex = ctx.match;
    let coinData = top10Coins.at(targetCoinIndex);
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `Coin\t${coinData.CoinInfo.FullName}\nPrice\t${coinData.RAW.USD.PRICE}$`
    );
    await ctx.answerCbQuery();
  } catch (error) {
    await ctx.answerCbQuery();
  }
});

//for getting All following list
bot.action('F-list', async (ctx) => {
  try {
    let username = ctx.update.callback_query.from.username;
    let sendData = 'EmptyList';
    if (followList[username]) {
      followList[username].length > 0
        ? (sendData = `${followList[username]}`)
        : '';
      await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Hello ${username} these are all the coins you currently follows : [ ${sendData} ]`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Back', callback_data: 'back-to-menu' }],
            ],
          },
        }
      );
    } else {
      await ctx.telegram.sendMessage(
        ctx.chat.id,
        `Hello ${username} you are not following any coin currentlly...`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Back', callback_data: 'back-to-menu' }],
            ],
          },
        }
      );
    }
    ctx.answerCbQuery();
  } catch (error) {
    console.log('Error', error);
    ctx.reply('waitting...');
  }
});

//follow specific crypto state
bot.action('follow', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'to follow its status', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Etheruim ⟠', callback_data: 'F_ETH' },
          { text: 'Bit Coin ₿', callback_data: 'F_BTC' },
        ],

        [
          { text: ' XRP ✕', callback_data: 'F_XRP' },
          { text: 'Dogecoin Ð', callback_data: 'F_DOGE' },
        ],
        [{ text: '>', callback_data: 'F_more-coin' }],
        [{ text: 'Back', callback_data: 'back-to-menu' }],
      ],
    },
  });
  ctx.answerCbQuery();
});

//more coin for follow coin
bot.action('F_more-coin', (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    'Choose a Crypto to follow its status',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Tether ₮', callback_data: 'F_USDT' },
            { text: 'Cardano ₳', callback_data: 'F_ADA' },
          ],

          [
            { text: 'Litecoin Ł', callback_data: 'F_LTC' },
            { text: 'Filecoin ⨎', callback_data: 'F_FIL' },
          ],
          [{ text: '<', callback_data: 'follow' }],
          [{ text: 'Back', callback_data: 'back-to-menu' }],
        ],
      },
    }
  );
  ctx.answerCbQuery();
});

//back to main menu
bot.action('back-to-menu', async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    `Please choose a buttton to continue.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Show Prices', callback_data: 'price' },
            { text: 'Watch Crypto', callback_data: 'follow' },
          ],
          [
            { text: 'Top 10', callback_data: 'T-list' },
            { text: 'My Watch List', callback_data: 'F-list' },
          ],
        ],
      },
    }
  );
  ctx.answerCbQuery();
});

const coinArr = [
  'F_ETH',
  'F_BTC',
  'F_XRP',
  'F_DOGE',
  'F_USDT',
  'F_ADA',
  'F_LTC',
  'F_FIL',
  'P_ETH',
  'P_BTC',
  'P_XRP',
  'P_DOGE',
  'P_USDT',
  'P_ADA',
  'P_LTC',
  'P_FIL',
];

// increase Scale by 5

bot.action('I_5', (ctx) => {
  if (scale >= 40) {
    ctx.reply(
      'The scale is too much .\nKnow that you will not recive updates quickly.'
    );
    scale += 5;
  } else {
    scale += 5;
  }
});
bot.action('D_5', (ctx) => {
  if (scale <= 5) {
    ctx.reply('The scale is already at minimum');
  } else {
    scale -= 5;
  }
});

// stop following
bot.action('F_stop', (ctx) => {
  shouldStop = true;
  let symbol = ctx.update.callback_query.message.text.split('coin')[0].trim();
  let username = ctx.update.callback_query.from.username;
  let sendData = 'empty List';
  if (followList[username]) {
    followList[username].forEach(async (coin, index, object) => {
      if (coin == symbol) {
        object.splice(index, 1);
        followList[username].length > 0
          ? (sendData = `${followList[username]}`)
          : '';
        await ctx.sendMessage(
          ctx.chat.id,
          `${symbol} coin is removed from your #followList\nFollow list : [ ${sendData} ]\nchoose a buttton to continue.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Back', callback_data: 'back-to-menu' }],
              ],
            },
          }
        );
      }
    });
    console.log('stopped following..');
    ctx.answerCbQuery();
  } else {
    console.log('You are not following this coin');
    ctx.answerCbQuery();
  }
  console.log('stopped following..');
  ctx.answerCbQuery();
});

// each coin price
bot.action(coinArr, async (ctx) => {
  symbol = ctx.match.split('_')[1];
  //console.log(ctx);
  let choosedMenu = ctx.match.split('_')[0];

  if (choosedMenu == 'F') {
    //follow the state given coin
    let username = ctx.from.username;
    followList[username] = followList[username] || [];
    followList[username].push(symbol);

    const follMessage = `#${symbol} coin is added to your Follow list\nThe Bot will let you Know if the price changes by using scale = ${scale}`;
    await ctx.telegram.sendMessage(ctx.chat.id, follMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Increase Scale by 5', callback_data: 'I_5' },
            { text: 'Decrease Scale by 5', callback_data: 'D_5' },
          ],
          [{ text: 'Back to Main Menu', callback_data: 'back-to-menu' }],
        ],
      },
    });

    try {
      for (let i = 0; i < followList[username].length; i++) {
        let res = await axios.get(
          `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${followList[username][i]}&tsym=USD&limit=10&api_key=${API_KEY}`
        );
        let cond = res.data.Data.Data;

        let high = cond[0].high;
        let high10 = cond[10].high;

        let low = cond[0].low;
        let low10 = cond[10].low;

        //console.log(high, high10);
        if (high10 - high >= scale) {
          console.log('bingo');
          let res = await axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${followList[username][i]}&tsyms=USD&api_key=${API_KEY}`
          );

          let priceNow = res.data.USD;
          // console.log(priceNow);
          const incMessage = `${
            followList[username][i]
          } coin is increasing in price\nCurrent Price :${priceNow}$ ,${(
            priceNow * 60
          ).toFixed(2)}birr`;
          setTimeout(async () => {
            await ctx.telegram.sendMessage(ctx.chat.id, incMessage, {
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: 'Increase Scale by 5', callback_data: 'I_5' },
                    { text: 'Decrease Scale by 5', callback_data: 'D_5' },
                  ],
                  [
                    {
                      text: 'Stop following this coin ',
                      callback_data: 'F_stop',
                    },
                  ],
                  [
                    {
                      text: 'Back to Main Menu',
                      callback_data: 'back-to-menu',
                    },
                  ],
                ],
              },
            });
          }, 5000);
        } else if (low10 - low >= scale) {
          console.log('bingo');
          let res = await axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${followList[username][i]}&tsyms=USD&api_key=${API_KEY}`
          );
          let priceNow = res.data.USD;
          //console.log(priceNow);
          let decMessage = `${
            followList[username][i]
          } coin is decreasing in price\nCurrent Price :${priceNow}$, ${(
            priceNow * 60
          ).toFixed(2)}birr`;
          await ctx.telegram.sendMessage(ctx.chat.id, decMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Increase Scale by 5', callback_data: 'I_5' },
                  { text: 'Decrease Scale by 5', callback_data: 'D_5' },
                ],
                [
                  {
                    text: 'Stop following this coin ',
                    callback_data: 'F_stop',
                  },
                ],
                [
                  {
                    text: 'Back to Main Menu',
                    callback_data: 'back-to-menu',
                  },
                ],
              ],
            },
          });
        } else {
          continue;
        }
      }
    } catch (error) {
      console.log('Error', error);
      ctx.reply('waiting...');
      ctx.answerCbQuery();
    }
    ctx.answerCbQuery();
  }

  if (choosedMenu == 'P') {
    try {
      //get price info of that coin
      let res = await axios.get(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${API_KEY}`
      );
      //console.log(res);
      let coinPrice = res.data.DISPLAY[symbol].USD.PRICE;
      let imageUrl = res.data.DISPLAY[symbol].USD.IMAGEURL;
      let OPENDAY = res.data.DISPLAY[symbol].USD.OPENDAY;
      let HIGHDAY = res.data.DISPLAY[symbol].USD.HIGHDAY;
      let LOWDAY = res.data.DISPLAY[symbol].USD.LOWDAY;
      let MARKET = res.data.DISPLAY[symbol].USD.MARKET;

      let sendData = `Coin : ${symbol}\nPrice: ${coinPrice}$,\t${(
        coinPrice.split(' ')[1].replace(',', '') * 60
      ).toFixed(2)}birr\nOpenDay: ${OPENDAY}$,\t${(
        OPENDAY.split(' ')[1].replace(',', '') * 60
      ).toFixed(2)}birr\nHighDay: ${HIGHDAY}$,\t${(
        HIGHDAY.split(' ')[1].replace(',', '') * 60
      ).toFixed(2)}birr\nLowDay: ${LOWDAY}$,\t${(
        LOWDAY.split(' ')[1].replace(',', '') * 60
      ).toFixed(2)}birr\nMarket: ${MARKET}`;
      ctx.telegram.sendPhoto(
        ctx.chat.id,
        `https://www.cryptocompare.com/${imageUrl}`
      );
      setTimeout(async () => {
        await ctx.telegram.sendMessage(ctx.chat.id, sendData, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Back', callback_data: 'back-to-menu' }],
            ],
          },
        });
        ctx.answerCbQuery();
      }, 200);
    } catch (error) {}
  }
});

module.exports = bot;
