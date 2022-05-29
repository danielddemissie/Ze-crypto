const backToMenu = (bot) => {
  return bot.action('back-to-menu', async (ctx) => {
    await ctx.reply(`Please choose a buttton to continue.`, {
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
    await ctx.answerCbQuery();
  });
};
module.exports = backToMenu;
