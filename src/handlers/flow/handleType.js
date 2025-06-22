/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleType.js

const { ACCS } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');

async function handleTypeStep(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');
  const lng = detectLang(query.message);

  state[chatId].type = value;
  state[chatId].step = 'acc';
  resetTimeout(chatId, bot);

  const kb = [
    [{ text: t('buttons.back', { lng }), callback_data: 'back:type' }],
    ...ACCS.map(a => [{ text: t(a.text, { lng }), callback_data: a.callback_data }])
  ];

  await bot.editMessageText(
    t('flow.choose_acc.prompt', { lng, value }),
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = { handleTypeStep };
