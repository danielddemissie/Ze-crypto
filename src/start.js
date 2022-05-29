const startBot = (bot) => {
  return bot.start((ctx) => {
    let username = ctx.update.message.from.first_name;
    ctx.reply(`Hello ${username}. Welcome to ዘCrypto`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Show Prices', callback_data: 'price' },
            { text: 'Watch Crypto', callback_data: 'follow' },
          ],
          [
            { text: 'Popular', callback_data: 'T-list' },
            { text: 'My Watch List', callback_data: 'F-list' },
          ],
        ],
      },
    });
  });
};
module.exports = startBot;
