const { PythonShell } = require('python-shell');
let ps = new PythonShell('main.py');

const priceHistoryOf = (bot) => {
  return bot.hears('Price History', (ctx) => {
    let coinName;
    let userName;

    ctx.reply('Enter the Coin Symobl Like BTC,ETH...');
    bot.on('message', (ctx) => {
      coinName = ctx.update.message.text.toUpperCase() + '-USD';
      userName = ctx.update.message.from.username;
      ps.send(coinName + '_' + userName);
      ps.on('message', (msg) => {
        ctx.telegram.sendPhoto(ctx.chat.id, '/images/fig1.png');
      });

      ps.end(function (err) {
        if (err) {
          console.log('error');
        } else {
          console.log('success.');
        }
      });
    });
  });
};

module.exports = priceHistoryOf;
