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
  const messageId = query.message.message_id;
  const lng = detectLang(query.message);

  state[chatId] = { step: 'root', msgId: messageId };
  resetTimeout(chatId, bot);

  const rootKB = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  );
  const quickRow = [
    { text: t('buttons.help', { lng }), callback_data: 'show_help' },
    { text: t('buttons.cancel', { lng }), callback_data: 'quick_cancel' },
    { text: t('buttons.language', { lng }), callback_data: 'show_lang' }
  ];

  await bot.editMessageText(
    t('flow.choose_root.prompt', { lng }),
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
  const lng = detectLang(query.message);

  return bot.sendMessage(chatId,
    t('quick_actions.help.text', { lng }),
    { parse_mode: 'Markdown' }
  );
}

function handleQuickCancel(query, bot, state) {
  const chatId = query.message.chat.id;

  const lng = detectLang(query.message);

  if (state[chatId]?.timer) clearTimeout(state[chatId].timer);
  delete state[chatId];

  return bot.sendMessage(chatId, t('quick_actions.cancel.done', { lng }));
}

function handleShowLang(query, bot) {
  const chatId = query.message.chat.id;
  const lng = detectLang(query.message);
  const keyboard = [[
    { text: t('languages.en', { lng }), callback_data: 'lang:en' },
    { text: t('languages.pt', { lng }), callback_data: 'lang:pt' }
  ]];
  return bot.sendMessage(chatId, t('commands.lang.choose', { lng }), {
    reply_markup: { inline_keyboard: keyboard }
  });
}

function handleSetLang(query, bot, state) {
  const chatId = query.message.chat.id;
  const [, code] = query.data.split(':');
  if (!state[chatId]) state[chatId] = {};
  state[chatId].lang = code;
  return bot.answerCallbackQuery(query.id, { text: t('commands.lang.updated', { lng: code }) });
}

module.exports = {
  handleRestart,
  handleShowHelp,
  handleQuickCancel,
  handleShowLang,
  handleSetLang
};
