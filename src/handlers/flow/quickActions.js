/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/quickActions.js

const { ROOTS, twoColumn } = require('../../keyboards');
const { t, detectLang } = require('../../i18n');

async function handleRestart(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;

  const previousId = state[chatId]?.msgId;
  const messageId = previousId || query.message.message_id;

  const current = state[chatId] || {};
  const lng = current.lang || detectLang(query.message);

  state[chatId] = { ...current, step: 'root', msgId: messageId, lang: lng };
  resetTimeout(chatId, bot, t('errors.session_timeout', { lng }));

  const rootKB = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  );
  const quickKB = twoColumn([
    { text: t('buttons.help', { lng }),  callback_data: 'show_help' },
    { text: t('buttons.cancel', { lng }), callback_data: 'quick_cancel' },
    { text: t('buttons.lang', { lng }),  callback_data: 'show_lang' }
  ]);

  await bot.editMessageText(
    t('flow.choose_root', { lng }),
    {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [...quickKB, ...rootKB] }
    }
  );
}


async function handleShowHelp(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = (state[chatId]?.lang) || detectLang(query.message);

  await bot.answerCallbackQuery(query.id, {
    text: t('quick.help.text', { lng }),
    show_alert: true
  });
}


function handleQuickCancel(query, bot, state) {
  const chatId = query.message.chat.id;
  const lng = state[chatId].lang || detectLang(query.message);

  if (state[chatId]?.timer) clearTimeout(state[chatId].timer);
  delete state[chatId];

  return bot.sendMessage(chatId, t('quick.cancelled', { lng }));
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

  if (!state[chatId]) state[chatId] = {};
  state[chatId].lang = code;

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
