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
const pad = (str, len = 18) =>
  str.length >= len ? str : str + ' '.repeat(len - str.length)

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
  { text: '♮', callback_data: 'acc:' },
  { text: '♭', callback_data: 'acc:b' },
  { text: '♯', callback_data: 'acc:#' },
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

const SESSION_TTL_MS = 5 * 60 * 1000 // 5 minutes

function resetTimeout(chatId) {
  if (state[chatId]?.timer) clearTimeout(state[chatId].timer)
  state[chatId].timer = setTimeout(() => {
    if (state[chatId]) {
      delete state[chatId]
      bot.sendMessage(chatId, '⌛ Session expired. Use /start to begin again.')
    }
  }, SESSION_TTL_MS)
}

// 1️⃣ /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  state[chatId] = { step: 'root' }

  const rootKeyboard = twoColumn(
    ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  )
  const quickRow = [
    { text: '📖 Help',   callback_data: 'show_help' },
    { text: '❌ Cancel', callback_data: 'quick_cancel' }
  ]

  const text =
    '🎷 *Welcome to Jazz Impro Bot!*\n\n' +
    '*Quick actions*\n' +
    '📖 Help – instructions\n' +
    '❌ Cancel – end session\n\n' +
    '👇 *Choose a root note to jam*'

  // save the returned message id
  const sent = await bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [quickRow, ...rootKeyboard] }
  })
  state[chatId].msgId = sent.message_id
  resetTimeout(chatId)
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
    if (state[chatId].timer) clearTimeout(state[chatId].timer)
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

  if (query.data === 'restart') {
    state[chatId] = { step: 'root', msgId: messageId }
    resetTimeout(chatId)

    const rootKB = twoColumn(
      ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
    )
    const quickRow = [
      { text: '📖 Help',   callback_data: 'show_help' },
      { text: '❌ Cancel', callback_data: 'quick_cancel' }
    ]

    await bot.editMessageText(
      '*Choose a root note to jam*',
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [quickRow, ...rootKB] }
      }
    )
    return
  } 

  if (query.data === 'back:root') {
  state[chatId] = { step: 'root', msgId: state[chatId].msgId }

    const kb = twoColumn(
      ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
    )

    await bot.editMessageText(
      '*Choose a root note to jam*',
      {
        chat_id: chatId,
        message_id: state[chatId].msgId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: kb }
      }
    )
    return
  }

  if (query.data === 'back:type') {
    state[chatId].step = 'type'

    const kb = [
      [{ text: '⬅️ Back', callback_data: 'back:root' }],
      ...TYPES.map(t => [t])
    ]

    await bot.editMessageText(
      `Root note *${state[chatId].root}* chosen! ✅\nChoose the chord quality:`,
      {
        chat_id: chatId,
        message_id: state[chatId].msgId,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: kb }
      }
    )
    return
  }

     // 🔔 Help button
    if (query.data === 'show_help') {
     bot.sendMessage(
       chatId,
       '*How to jam with Jazz Impro Bot* 🎶\n' +
         '1. Send /start and pick a root note.\n' +
         '2. Choose chord quality and accidental.\n' +
         '3. I’ll suggest an improvisation chord.\n\n' +
         'Use /cancel (ou botão Cancelar) para parar.',
       { parse_mode: 'Markdown' }
     )
     return
   }
 
   // 🔔 Cancel button
  if (query.data === 'quick_cancel') {
    if (state[chatId]?.timer) clearTimeout(state[chatId].timer)
    delete state[chatId]
    bot.sendMessage(chatId, '❌ Sessão cancelada. Use /start para recomeçar.')
    return
  }

  if (!state[chatId]) {
    bot.sendMessage(chatId, '⚠️ Session expired. Send /start to begin again.')
    return
  }

  try {
    if (step === 'root' && state[chatId].step === 'root') {
      state[chatId].root = value
      state[chatId].step = 'type'
      resetTimeout(chatId);

      const kb = [
        [{ text: '⬅️ Back', callback_data: 'back:root' }],
        ...TYPES.map(t => [t])
      ]

      await bot.editMessageText(
        `Root note *${value}* chosen! ✅\nChoose the chord quality:`,
        {
          chat_id: chatId,
          message_id: state[chatId].msgId,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: kb }
        }
      )
      return
    }

    if (step === 'type' && state[chatId].step === 'type') {
      state[chatId].type = value
      state[chatId].step = 'acc'
      resetTimeout(chatId);

      const kb = [
        [{ text: '⬅️ Back', callback_data: 'back:type' }],
        ...ACCS.map(a => [a])
      ]

      await bot.editMessageText(
        `Quality *${value}* selected! ✅\nAdd an accidental if needed:`,
        {
          chat_id: chatId,
          message_id: state[chatId].msgId,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: kb }
        }
      )
      return
    }

    if (step === 'acc' && state[chatId].step === 'acc') {
      await bot.editMessageText(
        `Accidental *${value || 'none'}* set! ✅\n\nCalculating…`,
        {
          chat_id: chatId,
          message_id: state[chatId].msgId,
          parse_mode: 'Markdown',
        }
      )
      //Typing message
      await bot.sendChatAction(chatId, 'typing')
      await new Promise(resolve => setTimeout(resolve, 700))   

      const { root, type } = state[chatId]
      const fullChord = `${root}${value}${type.replace(/^b/, '')}`
      // Chord Objects
      const chord       = Chord.parse(fullChord)
      const improvChord = getImprovisationChord(chord)

       /* // Option use toString() only
      const baseLabel   = chord.toString()
      const improvLabel = improvChord.toString()
      */
      // Option B – symbol + notes
      const baseLabel   = `${chord.toString().split(':')[0]} (${chord.getNotes().join(' ')})`
      const improvLabel = `${improvChord.toString().split(':')[0]} (${improvChord.getNotes().join(' ')})`
      
      // ---------------------------------------------------------------
      const pad = (str, len = 25) => (str.length >= len ? str : str + ' '.repeat(len - str.length))

      const htmlResult =
        '🎼 <b>Resultado</b>\n' +
        '<pre>' +
        `${pad('Base chord')} | ${baseLabel}\n` +
        `${pad('Improv. chord')} | ${improvLabel}\n` +
        '</pre>'

      await bot.editMessageText(htmlResult, {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[{ text: '🔁 New Chord', callback_data: 'restart' }]] }
    })
      if (state[chatId]?.timer) clearTimeout(state[chatId].timer);
      delete state[chatId]
    }
  } catch (err) {
    console.error(err)
    bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again later.')
  }
})
