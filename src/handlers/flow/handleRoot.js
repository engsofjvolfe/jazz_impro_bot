/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleRoot.js

const { TYPES } = require('../../keyboards');

async function handleRootStep(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');

  state[chatId].root = value;
  state[chatId].step = 'type';
  resetTimeout(chatId, bot);

  const kb = [
    [{ text: '⬅️ Back', callback_data: 'back:root' }],
    ...TYPES.map(t => [t])
  ];

  await bot.editMessageText(
    `Root note *${value}* chosen! ✅\nChoose the chord quality:`,
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = { handleRootStep };
