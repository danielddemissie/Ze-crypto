const startBot = (bot) => {
  return bot.start((ctx) => {
    let username = ctx.update.message.from.first_name;
    ctx.reply(`Hello ${username}. Welcome to ዘCrypto`, {
      reply_markup: {
        keyboard: [
          ['Show Prices', 'Watch Crypto'],
          ['Popular', 'My Watch List'],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  });
};
module.exports = startBot;
