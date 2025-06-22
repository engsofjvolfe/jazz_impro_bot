/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/backNavigation.js

const { ROOTS, TYPES, twoColumn } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');

async function handleBackToRoot(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = detectLang(query.message);

  state[chatId] = { step: 'root', msgId: state[chatId].msgId };

  const kb = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  );

  await bot.editMessageText(
    t('flow.choose_root.prompt', { lng }),
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

async function handleBackToType(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = detectLang(query.message);

  state[chatId].step = 'type';

  const kb = [
    [{ text: t('buttons.back', { lng }), callback_data: 'back:root' }],
    ...TYPES.map(btn => [{ text: t(btn.text, { lng }), callback_data: btn.callback_data }])
  ];

  await bot.editMessageText(
    t('flow.choose_type.prompt', { lng, value: state[chatId].root }),
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = {
  handleBackToRoot,
  handleBackToType
};
