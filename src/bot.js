
/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/bot.js

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const { state, resetTimeout } = require('./session');
const { handleStart, handleHelp, handleCancel } = require('./handlers/commands');
const { handleCallback } = require('./handlers/callbacks');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('⚠️  Define the TELEGRAM_TOKEN variable in the .env file');
  process.exit(1);
}

const isFakeToken = token === 'fake-token';
const bot = new TelegramBot(token, { polling: !isFakeToken });

if (isFakeToken) {
  console.warn('⚠️  Running with fake token. Polling disabled to avoid 404 error.');
}

console.log('🤖 Bot successfully started. Awaiting commands...');

// Commands
bot.onText(/\/start/, (msg) => handleStart(bot, msg, state, resetTimeout))
bot.onText(/\/help/,  (msg) => handleHelp(bot, msg))
bot.onText(/\/cancel/, (msg) => handleCancel(bot, msg, state))

// Unknown command
bot.onText(/^\/(?!start|help|cancel).+/, (msg) => {
  bot.sendMessage(msg.chat.id, "🤔 I don't recognize that command. Try /help.")
})

// Callback queries
bot.on('callback_query', (query) => handleCallback(query, bot, state, resetTimeout))
