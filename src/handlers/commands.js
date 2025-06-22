/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/commands.js

const { ROOTS, twoColumn } = require('../keyboards');
const { t, detectLang } = require('../i18n');

function handleStart(bot, msg, state, resetTimeout) {
  const chatId = msg.chat.id
  const lng = detectLang(msg)
  state[chatId] = { step: 'root', lang: lng }

  const rootKeyboard = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  )
  const quickRow = [
    { text: t('buttons.help', { lng }), callback_data: 'show_help' },
    { text: t('buttons.cancel', { lng }), callback_data: 'quick_cancel' },
    { text: t('buttons.lang', { lng }), callback_data: 'show_lang' }
  ]

  const text = t('commands.start.welcome', { lng })

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [quickRow, ...rootKeyboard] }
  }).then(sent => {
    state[chatId].msgId = sent.message_id
    resetTimeout(chatId, bot, t('errors.session_timeout', { lng }))
  })
}

function handleHelp(bot, msg) {
  const chatId = msg.chat.id
  const lng = detectLang(msg)
  const text = t('commands.help.text', { lng })
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
}

function handleCancel(bot, msg, state) {
  const chatId = msg.chat.id
  const lng = detectLang(msg)
  if (state[chatId]) {
    if (state[chatId].timer) clearTimeout(state[chatId].timer)
    delete state[chatId]
    bot.sendMessage(
      chatId,
      t('commands.cancel.done', { lng })
    )
  } else {
    bot.sendMessage(chatId, t('commands.cancel.no_active', { lng }))
  }
}

function handleLang(bot, msg, state, code) {
  const chatId = msg.chat.id
  const lng = detectLang(msg)
  if (!['en', 'pt'].includes(code)) {
    return bot.sendMessage(chatId, t('commands.lang.unsupported', { lng }))
  }
  if (!state[chatId]) state[chatId] = {}
  state[chatId].lang = code
  return bot.sendMessage(chatId, t('commands.lang.set', { lng: code, lang: code }))
}

module.exports = { handleStart, handleHelp, handleCancel, handleLang }
