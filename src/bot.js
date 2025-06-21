/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/bot.js

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Chord } = require('./chord');
const { getImprovisationChord } = require('./improvisation');

// Initializes the bot using the token from .env or fake_token
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('⚠️  Define the TELEGRAM_TOKEN variable in the .env file');
  process.exit(1);
}

const isFakeToken = token === 'fake-token';

// Só ativa o polling se o token for real
const bot = new TelegramBot(token, { polling: !isFakeToken });

if (isFakeToken) {
  console.warn('⚠️  Rodando com token falso. Polling desativado para evitar erro 404.');
}

console.log('🤖 Bot successfully started. Awaiting commands...');

// In-memory state per chatId
const state = {};

// 1️⃣ /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  state[chatId] = { step: 'root' }

  const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const keyboard = []
  for (let i = 0; i < roots.length; i += 2) {
    const row = [
      { text: roots[i], callback_data: `root:${roots[i]}` }
    ]
    if (roots[i + 1]) {
      row.push({ text: roots[i + 1], callback_data: `root:${roots[i + 1]}` })
    }
    keyboard.push(row)
  }

  bot.sendMessage(
    chatId,
    '🎷 *Welcome to Jazz Impro Bot!*\n' +
      'Select a root note to begin or send /help for info.',
    {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    }
  )
})

// 2️⃣ /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const text =
    '*How to use:*\n' +
    '1. Send /start to begin.\n' +
    '2. Choose a root note, chord type and accidental.\n' +
    '3. Receive a suggested improvisation chord.\n\n' +
    'Use /cancel to abort at any time. Enjoy the jam! 🎶'
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
})

// 3️⃣ /cancel command
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id
  if (state[chatId]) {
    delete state[chatId]
    bot.sendMessage(chatId, '⛔️ Session cancelled. Send /start to try again.')
  } else {
    bot.sendMessage(chatId, 'No active session. Send /start to begin.')
  }
})

// Unknown command handler
bot.onText(/^\/(?!start|help|cancel).+/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, '🤔 Unknown command. Try /help for guidance.')
})

// 2️⃣ Handles button interactions
bot.on('callback_query', async (callbackQuery) => {
  await bot.answerCallbackQuery(callbackQuery.id)
  const data = callbackQuery.data
  const message = callbackQuery.message

  const chatId = message.chat.id
  const messageId = message.message_id
  const [step, value] = data.split(':')

  if (!state[chatId]) {
    bot.sendMessage(chatId, 'Session expired. Send /start to begin again.')
    return
  }

  // Root note selection
  if (step === 'root' && state[chatId].step === 'root') {
    state[chatId].root = value
    state[chatId].step = 'type'

    await bot.editMessageText(`Root note chosen: *${value}* ✅`, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    })

    // Sends chord type options
    const types = [
      { text: 'Major',     callback_data: 'type:maj7' },
      { text: 'Minor',     callback_data: 'type:m7'   },
      { text: 'Dominant',  callback_data: 'type:7'    },
      { text: 'Half-dim.', callback_data: 'type:m7b5' },
      { text: 'Diminished',callback_data: 'type:dim7' }
    ];
    await bot.sendMessage(chatId, 'Choose the chord quality:', {
      reply_markup: { inline_keyboard: types.map(t => [t]) }
    })
    return;
  }

  // Type selection
  if (step === 'type' && state[chatId].step === 'type') {
    state[chatId].type = value;
    state[chatId].step = 'acc';

    // Confirms selection and removes previous buttons
    await bot.editMessageText(`Chord quality chosen: *${value}* ✅`, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    });

    // Sends accidental options
    const accs = [
      { text: '♭', callback_data: 'acc:b'  },
      { text: '♯', callback_data: 'acc:#' },
      { text: 'natural', callback_data: 'acc:' }  // no accidental
    ];
    await bot.sendMessage(chatId, 'Add an accidental if needed:', {
      reply_markup: { inline_keyboard: accs.map(a => [a]) }
    })
    return;
  }

  // Accidental selection -> calculate and respond
  if (step === 'acc' && state[chatId].step === 'acc') {
    const { root, type } = state[chatId];
    const accidental = value; // 'b', '#', or ''
    const fullChord = `${root}${accidental}${type}`;

    // Confirms selection and removes previous buttons
    await bot.editMessageText(`Accidental chosen: *${accidental || 'none'}* ✅`, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    });

    try {
      const chord = Chord.parse(fullChord);
      const improv = getImprovisationChord(chord);

      // Sends final result
      await bot.sendMessage(
        chatId,
        `🎵 *Base chord*: ${chord.toString()}` +
          `\n🎸 *Improvisation chord*: ${improv.toString()}`,
        { parse_mode: 'Markdown' }
      )
    } catch (e) {
      await bot.sendMessage(chatId, `⚠️ Error: ${e.message}`)
    }

    // Clears state
    delete state[chatId];
  }
});
