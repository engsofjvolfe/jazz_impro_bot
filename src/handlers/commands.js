/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/commands.js

const { ROOTS, twoColumn } = require('../keyboards');

function handleStart(bot, msg, state, resetTimeout) {
  const chatId = msg.chat.id
  state[chatId] = { step: 'root' }

  const rootKeyboard = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  )
  const quickRow = [
    { text: '📖 Help',   callback_data: 'show_help' },
    { text: '❌ Cancel', callback_data: 'quick_cancel' }
  ]

  const text =
    '🎷 *Welcome to Jazz Impro Bot!*\n\n' +
    '*Quick actions*\n' +
    '📖 Help – instructions\n' +
    '❌ Cancel – end session\n\n' +
    '👇 *Choose a root note to jam*'

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [quickRow, ...rootKeyboard] }
  }).then(sent => {
    state[chatId].msgId = sent.message_id
    resetTimeout(chatId, bot)
  })
}

function handleHelp(bot, msg) {
  const chatId = msg.chat.id
  const text =
    '*How to jam with Jazz Impro Bot* 🎶\n' +
    '1. Send /start and pick a root note.\n' +
    '2. Choose the chord quality and an accidental if needed.\n' +
    "3. I'll suggest a chord a fifth above to inspire your solo.\n\n" +
    'Use /cancel to stop and /start to begin again.'
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
}

function handleCancel(bot, msg, state) {
  const chatId = msg.chat.id
  if (state[chatId]) {
    if (state[chatId].timer) clearTimeout(state[chatId].timer)
    delete state[chatId]
    bot.sendMessage(
      chatId,
      "🚫 Session cancelled. Use /start when you're ready to jam again."
    )
  } else {
    bot.sendMessage(chatId, 'No active session. Use /start to begin.')
  }
}

module.exports = { handleStart, handleHelp, handleCancel }
