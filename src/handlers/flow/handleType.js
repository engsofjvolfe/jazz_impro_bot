/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleType.js

const { ACCS } = require('../../keyboards');

async function handleTypeStep(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');

  state[chatId].type = value;
  state[chatId].step = 'acc';
  resetTimeout(chatId, bot);

  const kb = [
    [{ text: '⬅️ Back', callback_data: 'back:type' }],
    ...ACCS.map(a => [a])
  ];

  await bot.editMessageText(
    `Quality *${value}* selected! ✅\nAdd an accidental if needed:`,
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: kb }
    }
  );
}

module.exports = { handleTypeStep };
