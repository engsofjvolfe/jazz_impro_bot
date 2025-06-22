/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/backNavigation.js

const { getRootKeyboard, threeColumn, TYPES } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');
const { getPrefs, getSession } = require('../../session');

async function handleBackToRoot(query, bot, state) {
  const chatId = query.message.chat.id;
  const prefs = getPrefs(chatId);
  const lng = prefs.lang || detectLang(query.message);

  const session = getSession(chatId);
  session.step = 'root';

  const kb = getRootKeyboard(lng, 2);

  await bot.editMessageText(
    t('flow.choose_root', { lng }),
    {
      chat_id: chatId,
      message_id: session.msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

async function handleBackToType(query, bot, state) {
  const chatId = query.message.chat.id;
  const prefs = getPrefs(chatId);
  const lng = prefs.lang || detectLang(query.message);

  const session = getSession(chatId);
  session.step = 'type';

  const kb = [
    [{ text: t('buttons.back', { lng }), callback_data: 'back:root' }],
    ...threeColumn(
      TYPES.map(tObj => ({ text: t(`chord_types.${tObj.key}`, { lng }), callback_data: tObj.callback_data }))
    )
  ];

  await bot.editMessageText(
    t('flow.root_chosen', { lng, root: session.root }),
    {
      chat_id: chatId,
      message_id: session.msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = {
  handleBackToRoot,
  handleBackToType
};
