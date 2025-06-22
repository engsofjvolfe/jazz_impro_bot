/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/session.js

const state = {};
const SESSION_TTL_MS = 5 * 60 * 1000;
const { t } = require('./i18n');

function resetTimeout(chatId, bot) {
  if (state[chatId]?.timer) clearTimeout(state[chatId].timer)
  state[chatId].timer = setTimeout(() => {
    if (state[chatId]) {
      const lng = state[chatId].lang || 'en'
      delete state[chatId]
      bot.sendMessage(chatId, t('session.expired', { lng }))
    }
  }, SESSION_TTL_MS)
}

module.exports = { state, resetTimeout }
