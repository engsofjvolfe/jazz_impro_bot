/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/backNavigation.js

const { ROOTS, TYPES, twoColumn } = require('../../keyboards');

async function handleBackToRoot(query, bot, state) {
  const chatId = query.message.chat.id;

  state[chatId] = { step: 'root', msgId: state[chatId].msgId };

  const kb = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  );

  await bot.editMessageText(
    '*Choose a root note to jam*',
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

  state[chatId].step = 'type';

  const kb = [
    [{ text: '⬅️ Back', callback_data: 'back:root' }],
    ...TYPES.map(t => [t])
  ];

  await bot.editMessageText(
    `Root note *${state[chatId].root}* chosen! ✅\nChoose the chord quality:`,
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
