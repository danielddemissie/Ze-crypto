const axios = require('axios');

const myWatchList = (bot, followList) => {
  return bot.hears('My Watch List', (ctx) => {
    try {
      let username = ctx.update.message.from.first_name;
      let sendData = 'EmptyList';
      if (followList[username]) {
        followList[username].length > 0
          ? (sendData = `${followList[username]}`)
          : '';
        ctx.reply(
          `Hello ${username} these are your watchLsit : [ ${sendData} ]`
        );
      } else {
        ctx.reply(
          `Hello ${username} you are not watching any coin currentlly...`
        );
      }
    } catch (error) {
      console.log('Error', error);
      ctx.reply('waitting...');
    }
  });
};

const toWatchList = (bot) => {
  return bot.hears('Watch Crypto', (ctx) => {
    ctx.reply('Please choose coin to watch.', {
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
        ],
      },
    });
  });
};

const moreWatchList = (bot) => {
  return bot.action('F_more-coin', async (ctx) => {
    ctx.editMessageText('Please choose coin to watch.', {
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
        ],
      },
    });
    await ctx.answerCbQuery();
  });
};

const stopWatchingCoin = (bot, shouldStop, followList) => {
  return bot.action('F_stop', (ctx) => {
    shouldStop = true;
    let symbol = ctx.update.callback_query.message.text.split('coin')[0].trim();
    let username = ctx.update.callback_query.from.first_name;
    let sendData = 'empty List';
    if (followList[username]) {
      followList[username].forEach(async (coin, index, object) => {
        console.log(coin);
        if (coin == symbol) {
          object.splice(index, 1);
          followList[username].length > 0
            ? (sendData = `${followList[username]}`)
            : '';
          await ctx.editMessageText(
            `${symbol} coin is removed from your watchList\n#watchlist  [ ${sendData} ].`
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
};

const startWatchingCoin = (
  bot,
  symbol,
  coinArr,
  followList,
  scale,
  API_KEY
) => {
  return bot.action(coinArr, async (ctx) => {
    symbol = ctx.match.split('_')[1];
    let username = ctx.update.callback_query.from.first_name;
    followList[username] = followList[username] || [];
    followList[username].push(symbol);
    const follMessage = `#${symbol} coin is added to your watchList.\nThe Bot will let you Know if the price changes.\nAt scale of ${scale}`;

    //listen for price change
    try {
      await ctx.reply(follMessage);
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
            await ctx.reply(incMessage, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Stop watching this coin ',
                      callback_data: 'F_stop',
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
          await ctx.reply(decMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Stop watching this coin ',
                    callback_data: 'F_stop',
                  },
                ],
              ],
            },
          });
        } else {
          console.log('error');
        }
      }
    } catch (error) {
      console.log('Error', error);
      ctx.reply('waiting...');
      ctx.answerCbQuery();
    }
    ctx.answerCbQuery();
  });
};

module.exports = {
  moreWatchList,
  myWatchList,
  toWatchList,
  startWatchingCoin,
  stopWatchingCoin,
};
