/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/quickActions.js

const { ROOTS, twoColumn } = require('../../keyboards');

async function handleRestart(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  state[chatId] = { step: 'root', msgId: messageId };
  resetTimeout(chatId, bot);

  const rootKB = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  );
  const quickRow = [
    { text: '📖 Help', callback_data: 'show_help' },
    { text: '❌ Cancel', callback_data: 'quick_cancel' }
  ];

  await bot.editMessageText(
    '*Choose a root note to jam*',
    {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [quickRow, ...rootKB] }
    }
  );
}

function handleShowHelp(query, bot) {
  const chatId = query.message.chat.id;

  return bot.sendMessage(chatId,
    '*How to jam with Jazz Impro Bot* 🎶\n' +
    '1. Send /start and pick a root note.\n' +
    '2. Choose chord quality and accidental.\n' +
    '3. I’ll suggest an improvisation chord.\n\n' +
    'Use /cancel (ou botão Cancelar) para parar.',
    { parse_mode: 'Markdown' }
  );
}

function handleQuickCancel(query, bot, state) {
  const chatId = query.message.chat.id;

  if (state[chatId]?.timer) clearTimeout(state[chatId].timer);
  delete state[chatId];

  return bot.sendMessage(chatId, '❌ Sessão cancelada. Use /start para recomeçar.');
}

module.exports = {
  handleRestart,
  handleShowHelp,
  handleQuickCancel
};
