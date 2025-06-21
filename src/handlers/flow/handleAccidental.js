/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/handlers/flow/handleAccidental.js

const { Chord } = require('../../chord');
const { getImprovisationChord } = require('../../improvisation');

function pad(str, len = 25) {
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

async function handleAccStep(query, bot, state) {
  const chatId = query.message.chat.id;
  const [, value] = query.data.split(':');

  await bot.editMessageText(
    `Accidental *${value || 'none'}* set! ✅\n\nCalculating…`,
    {
      chat_id: chatId,
      message_id: state[chatId].msgId,
      parse_mode: 'Markdown',
    }
  );

  await bot.sendChatAction(chatId, 'typing');
  await new Promise(res => setTimeout(res, 700));

  const { root, type } = state[chatId];
  const fullChord = `${root}${value}${type.replace(/^b/, '')}`;
  const chord = Chord.parse(fullChord);
  const improvChord = getImprovisationChord(chord);

  const baseLabel = `${chord.toString().split(':')[0]} (${chord.getNotes().join(' ')})`;
  const improvLabel = `${improvChord.toString().split(':')[0]} (${improvChord.getNotes().join(' ')})`;

  const htmlResult =
    '🎼 <b>Resultado</b>\n' +
    '<pre>' +
    `${pad('Base chord')} | ${baseLabel}\n` +
    `${pad('Improv. chord')} | ${improvLabel}\n` +
    '</pre>';

  await bot.editMessageText(htmlResult, {
    chat_id: chatId,
    message_id: state[chatId].msgId,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{ text: '🔁 New Chord', callback_data: 'restart' }]]
    }
  });

  if (state[chatId]?.timer) clearTimeout(state[chatId].timer);
  delete state[chatId];
}

module.exports = { handleAccStep };
