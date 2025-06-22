/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleType.js

const { ACCS, threeColumn } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');
const { getPrefs, getSession } = require('../../session');

async function handleTypeStep(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');

  const prefs = getPrefs(chatId);
  const lng = prefs.lang || detectLang(query.message);

  const session = getSession(chatId);
  session.type = value;
  session.step = 'acc';
  resetTimeout(chatId, bot, t('errors.session_timeout', { lng }));

  const kb = [
    [{ text: t('buttons.back', { lng }), callback_data: 'back:type' }],
    ...threeColumn(ACCS)
  ];

  await bot.editMessageText(
    t('flow.type_selected', { lng, quality: value }),
    {
      chat_id: chatId,
      message_id: session.msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = { handleTypeStep };
