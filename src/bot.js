
/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/bot.js

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { t, detectLang } = require('./i18n');

const { state, resetTimeout } = require('./session');
const { handleStart, handleHelp, handleCancel, handleLang } = require('./handlers/commands');
const { handleCallback } = require('./handlers/callbacks');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error(t('startup.no_token'));
  process.exit(1);
}

const isFakeToken = token === 'fake-token';
const bot = new TelegramBot(token, { polling: !isFakeToken });

if (isFakeToken) {
  console.warn(t('startup.fake_token'));
}

console.log(t('startup.ready'));

// Commands
bot.onText(/\/start/, (msg) => handleStart(bot, msg, state, resetTimeout))
bot.onText(/\/help/,  (msg) => handleHelp(bot, msg))
bot.onText(/\/cancel/, (msg) => handleCancel(bot, msg, state))
bot.onText(/\/lang (\w+)/, (msg, match) => handleLang(bot, msg, state, match[1]))

// Unknown command
bot.onText(/^\/(?!start|help|cancel|lang).+/, (msg) => {
  const lng = detectLang(msg);
  bot.sendMessage(msg.chat.id, t('bot.unknown_command', { lng }));
})

// Callback queries
bot.on('callback_query', (query) => handleCallback(query, bot, state, resetTimeout))
