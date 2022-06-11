const startBot = (bot) => {
  return bot.start((ctx) => {
    let username = ctx.update.message.from.first_name;
    ctx.reply(`Hello ${username}. Welcome to ዘCrypto`, {
      reply_markup: {
        keyboard: [
          ['Show Prices', 'Watch Crypto'],
          ['Popular', 'My Watch List'],
          ['Price History', 'Predict Coin'],
        ],
        one_time_keyboard: false,
        resize_keyboard: true,
      },
    });
  });
};
module.exports = startBot;
