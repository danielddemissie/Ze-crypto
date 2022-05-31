const axios = require('axios');

//list the available
//coin to get price
const coinListForPrice = (bot) => {
  return bot.hears('Show Prices', (ctx) => {
    ctx.reply(`Choose a Crypto To know the Price`, {
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
        ],
      },
    });
  });
};

//more list of coins

const morePriceList = (bot) => {
  return bot.action('P_more-coin', async (ctx) => {
    ctx.editMessageText('Choose a Crypto To know the Price.', {
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
        ],
      },
    });
    await ctx.answerCbQuery();
  });
};

//get price of choose coin
const getPriceOfChoosedCoin = (bot, symbol, coinArr, API_KEY) => {
  return bot.action(coinArr, async (ctx) => {
    symbol = ctx.match.split('_')[1];
    //console.log(ctx);
    let choosedMenu = ctx.match.split('_')[0];
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
          await ctx.reply(sendData);
          ctx.answerCbQuery();
        }, 200);
      } catch (error) {}
    }
  });
};

module.exports = {
  coinListForPrice,
  morePriceList,
  getPriceOfChoosedCoin,
};
