/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/session.js

const state = {}
const SESSION_TTL_MS = 5 * 60 * 1000

function getPrefs(chatId) {
  if (!state[chatId]) state[chatId] = {}
  if (!state[chatId].prefs) state[chatId].prefs = {}
  return state[chatId].prefs
}

function getSession(chatId) {
  if (!state[chatId]) state[chatId] = {}
  if (!state[chatId].session) state[chatId].session = {}
  return state[chatId].session
}

function clearSession(chatId) {
  if (state[chatId]?.session?.timer) clearTimeout(state[chatId].session.timer)
  if (state[chatId]) delete state[chatId].session
}

function resetTimeout(chatId, bot, text) {
  const sess = getSession(chatId)
  if (sess.timer) clearTimeout(sess.timer)
  sess.timer = setTimeout(() => {
    if (state[chatId]?.session) {
      delete state[chatId].session
      bot.sendMessage(chatId, text)
    }
  }, SESSION_TTL_MS)
}

module.exports = { state, resetTimeout, getPrefs, getSession, clearSession }
