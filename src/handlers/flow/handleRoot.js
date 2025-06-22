/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleRoot.js

const { TYPES } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');

async function handleRootStep(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');

  const lng = state[chatId].lang || detectLang(query.message);

  state[chatId].root = value;
  state[chatId].step = 'type';
  resetTimeout(chatId, bot, t('errors.session_timeout', { lng }));

  const kb = [
    [{ text: t('buttons.back', { lng }), callback_data: 'back:root' }],
    ...TYPES.map(tObj => [
      {
        text: t(`chord_types.${tObj.key}`, { lng }),
        callback_data: tObj.callback_data
      }
    ])
  ];

  await bot.editMessageText(
    t('flow.root_chosen', { lng, root: value }),
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = { handleRootStep };
