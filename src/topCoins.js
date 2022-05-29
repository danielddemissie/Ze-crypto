const axios = require('axios');

// topList
const getTop10List = (bot, top10Coins, API_KEY) => {
  return bot.action('T-list', async (ctx) => {
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
                  text: `${1}.${coinData[0].CoinInfo.Name}, ${
                    coinData[0].CoinInfo.FullName
                  }`,
                  callback_data: '0',
                },
                {
                  text: `${2}.${coinData[1].CoinInfo.Name}, ${
                    coinData[1].CoinInfo.FullName
                  }`,
                  callback_data: '1',
                },
              ],

              [
                {
                  text: `${3}.${coinData[2].CoinInfo.Name}, ${
                    coinData[2].CoinInfo.FullName
                  }`,
                  callback_data: '2',
                },
                {
                  text: `${4}.${coinData[3].CoinInfo.Name}, ${
                    coinData[3].CoinInfo.FullName
                  }`,
                  callback_data: '3',
                },
              ],
              [
                {
                  text: `${5}.${coinData[4].CoinInfo.Name}, ${
                    coinData[4].CoinInfo.FullName
                  }`,
                  callback_data: '4',
                },
                {
                  text: `${6}.${coinData[5].CoinInfo.Name}, ${
                    coinData[5].CoinInfo.FullName
                  }`,
                  callback_data: '5',
                },
              ],
              [
                {
                  text: `${7}.${coinData[6].CoinInfo.Name}, ${
                    coinData[6].CoinInfo.FullName
                  }`,
                  callback_data: '6',
                },
                {
                  text: `${8}.${coinData[7].CoinInfo.Name}, ${
                    coinData[7].CoinInfo.FullName
                  }`,
                  callback_data: '7',
                },
              ],
              [
                {
                  text: `${9}.${coinData[8].CoinInfo.Name}, ${
                    coinData[8].CoinInfo.FullName
                  }`,
                  callback_data: '8',
                },
                {
                  text: `${10}.${coinData[9].CoinInfo.Name}, ${
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
};

const getPriceOfTopCoins = (bot, top10Coins, API_KEY) => {
  return bot.action(
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    async (ctx) => {
      try {
        let targetCoinIndex = ctx.match;
        let coinData = top10Coins.at(targetCoinIndex);
        if (coinData.RAW) {
          ctx.reply(
            `Coin\t${coinData.CoinInfo.FullName}\nPrice\t${coinData.RAW.USD.PRICE}$`
          );
        } else {
          let symbol = coinData.CoinInfo.Name;
          let res = await axios.get(
            `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${API_KEY}`
          );
          let coinPrice = res.data.DISPLAY[symbol].USD.PRICE;
          ctx.reply(
            `Coin\t${coinData.CoinInfo.FullName}\nPrice\t${
              coinPrice.split(' ')[1]
            }$`
          );
        }

        await ctx.answerCbQuery();
      } catch (error) {
        await ctx.answerCbQuery();
      }
    }
  );
};

module.exports = {
  getTop10List,
  getPriceOfTopCoins,
};
