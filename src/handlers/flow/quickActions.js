/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/quickActions.js

const { getRootKeyboard, getQuickRow } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');
const { getPrefs, getSession, clearSession } = require('../../session');

async function handleRestart(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;

  const prefs = getPrefs(chatId);
  const lng = prefs.lang || detectLang(query.message);

  const messageId = state[chatId]?.session?.msgId || query.message.message_id;

  const session = getSession(chatId);
  session.step = 'root';
  session.msgId = messageId;
  resetTimeout(chatId, bot, t('errors.session_timeout', { lng }));

  const rootKB = getRootKeyboard(lng, 3);
  const quickRow = getQuickRow(lng);

  await bot.editMessageText(
    t('flow.choose_root', { lng }),
    {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [quickRow, ...rootKB] }
    }
  );
}


async function handleShowHelp(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = state[chatId]?.prefs?.lang || detectLang(query.message);

  await bot.answerCallbackQuery(query.id, {
    text: t('quick.help.text', { lng }),
    show_alert: true
  });
}


function handleQuickCancel(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = state[chatId]?.prefs?.lang || detectLang(query.message);

  clearSession(chatId);

  return bot.answerCallbackQuery(query.id, {
    text: t('quick.cancelled', { lng }),
    show_alert: false
  });
}

function handleShowLang(query, bot) {
  const chatId = query.message.chat.id;
  const lng = detectLang(query.message);
  const kb = [[
    { text: 'English', callback_data: 'set_lang:en' },
    { text: 'Português', callback_data: 'set_lang:pt' }
  ]];

  return bot.sendMessage(chatId, t('commands.lang.choose', { lng }), {
    reply_markup: { inline_keyboard: kb }
  });
}

async function handleSetLang(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const [, code] = query.data.split(':');

  const prefs = getPrefs(chatId);
  prefs.lang = code;

  // Confirmação rápida (toast)
  await bot.answerCallbackQuery(query.id, {
    text: t('commands.lang.set', { lng: code, lang: code }),
    show_alert: false
  });

  // Redesenha menu raiz já no novo idioma
  await handleRestart(query, bot, state, resetTimeout);

  // Agora podemos apagar a janela “Choose language”
  await bot.deleteMessage(chatId, query.message.message_id);
}

module.exports = {
  handleRestart,
  handleShowHelp,
  handleQuickCancel,
  handleShowLang,
  handleSetLang
};
