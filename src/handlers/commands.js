/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/commands.js

const { getRootKeyboard, getQuickRow } = require('../keyboards');
const { t, detectLang } = require('../i18n');
const { getPrefs, getSession, clearSession } = require('../session');

function handleStart(bot, msg, state, resetTimeout) {
  const chatId = msg.chat.id
  const prefs = getPrefs(chatId)
  const lng = prefs.lang || detectLang(msg)

  const oldId = state[chatId]?.session?.msgId
  if (oldId) bot.deleteMessage(chatId, oldId).catch(() => {})

  clearSession(chatId)
  const session = getSession(chatId)
  session.step = 'root'

  const rootKeyboard = getRootKeyboard(lng, 3)
  const quickRow = getQuickRow(lng)

  const text = t('commands.start.welcome', { lng })

  bot
    .sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [quickRow, ...rootKeyboard] }
    })
    .then(sent => {
      session.msgId = sent.message_id
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
  if (state[chatId]?.session) {
    clearSession(chatId)
    bot.sendMessage(chatId, t('commands.cancel.done', { lng }))
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
  if (!state[chatId].prefs) state[chatId].prefs = {}
  state[chatId].prefs.lang = code
  return bot.sendMessage(chatId, t('commands.lang.set', { lng: code, lang: code }))
}

module.exports = { handleStart, handleHelp, handleCancel, handleLang }
