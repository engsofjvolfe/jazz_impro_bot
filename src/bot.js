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

const ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const TYPES = [
  { text: 'Major', callback_data: 'type:maj7' },
  { text: 'Minor', callback_data: 'type:m7' },
  { text: 'Dominant', callback_data: 'type:7' },
  { text: 'Half-dim.', callback_data: 'type:m7b5' },
  { text: 'Diminished', callback_data: 'type:dim7' }
]
const ACCS = [
  { text: '♭', callback_data: 'acc:b' },
  { text: '♯', callback_data: 'acc:#' },
  { text: 'Natural', callback_data: 'acc:' }
]

function twoColumn(buttons) {
  const keyboard = []
  for (let i = 0; i < buttons.length; i += 2) {
    const row = [buttons[i]]
    if (buttons[i + 1]) row.push(buttons[i + 1])
    keyboard.push(row)
  }
  return keyboard
}

// 1️⃣ /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  state[chatId] = { step: 'root' }

  const keyboard = twoColumn(
    ROOTS.map((r) => ({ text: r, callback_data: `root:${r}` }))
  )

  const text =
    '🎷 *Welcome to Jazz Impro Bot!*\n' +
    'Tap a root note below to start jamming. Need help? Send /help.'

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard }
  })
})

// 2️⃣ /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const text =
    '*How to jam with Jazz Impro Bot* 🎶\n' +
    '1. Send /start and pick a root note.\n' +
    '2. Choose the chord quality and an accidental if needed.\n' +
    "3. I'll suggest a chord a fifth above to inspire your solo.\n\n" +
    'Use /cancel to stop and /start to begin again.'
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
})

// 3️⃣ /cancel command
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id
  if (state[chatId]) {
    delete state[chatId]
    bot.sendMessage(
      chatId,
      "🚫 Session cancelled. Use /start when you're ready to jam again."
    )
  } else {
    bot.sendMessage(chatId, 'No active session. Use /start to begin.')
  }
})

// Unknown command handler
bot.onText(/^\/(?!start|help|cancel).+/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, "🤔 I don't recognize that command. Try /help.")
})

// 2️⃣ Handles button interactions
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id
  const messageId = query.message.message_id
  const [step, value] = query.data.split(':')

  await bot.answerCallbackQuery(query.id)

  if (!state[chatId]) {
    bot.sendMessage(chatId, '⚠️ Session expired. Send /start to begin again.')
    return
  }

  try {
    if (step === 'root' && state[chatId].step === 'root') {
      state[chatId].root = value
      state[chatId].step = 'type'

      await bot.editMessageText(`Root note *${value}* chosen! ✅`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      })

      const kb = TYPES.map((t) => [t])
      await bot.sendMessage(chatId, 'Choose the chord quality:', {
        reply_markup: { inline_keyboard: kb }
      })
      return
    }

    if (step === 'type' && state[chatId].step === 'type') {
      state[chatId].type = value
      state[chatId].step = 'acc'

      await bot.editMessageText(`Quality *${value}* selected! ✅`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      })

      const kb = ACCS.map((a) => [a])
      await bot.sendMessage(chatId, 'Add an accidental if needed:', {
        reply_markup: { inline_keyboard: kb }
      })
      return
    }

    if (step === 'acc' && state[chatId].step === 'acc') {
      await bot.editMessageText(`Accidental *${value || 'none'}* set! ✅`, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      })

      const { root, type } = state[chatId]
      const fullChord = `${root}${value}${type}`
      const chord = Chord.parse(fullChord)
      const improv = getImprovisationChord(chord)

      await bot.sendMessage(
        chatId,
        `🎵 *Base chord*: ${chord.toString()}\n` +
          `🎸 *Improvisation chord*: ${improv.toString()}`,
        { parse_mode: 'Markdown' }
      )

      delete state[chatId]
    }
  } catch (err) {
    console.error(err)
    bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again later.')
  }
})
