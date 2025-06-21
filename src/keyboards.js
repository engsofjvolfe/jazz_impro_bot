/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/keyboards.js

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

module.exports = { ROOTS, TYPES, ACCS, twoColumn }
