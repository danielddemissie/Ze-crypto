const increaseScale = (bot) => {
  return bot.action('I_5', async (ctx) => {
    if (scale >= 40) {
      ctx.reply(
        'The scale is too much .\nKnow that you will not recive updates quickly.'
      );
      scale += 5;
    } else {
      ctx.reply('The scale is increased by 5.');
      scale += 5;
    }
    await ctx.answerCbQuery();
  });
};
const decreaseScale = (bot) => {
  return bot.action('D_5', async (ctx) => {
    if (scale <= 5) {
      ctx.reply('The scale is  already at minimum .');
      scale += 5;
    } else {
      ctx.reply('The scale is decreased by 5.');
      scale += 5;
    }
    await ctx.answerCbQuery();
  });
};
module.exports = {
  increaseScale,
  decreaseScale,
};
