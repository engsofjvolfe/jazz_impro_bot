/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/keyboards.js

const { t } = require('./i18n')

const ROOTS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const TYPES = [
  { key: 'major', callback_data: 'type:maj7' },
  { key: 'minor', callback_data: 'type:m7' },
  { key: 'dominant', callback_data: 'type:7' },
  { key: 'half_dim', callback_data: 'type:m7b5' },
  { key: 'diminished', callback_data: 'type:dim7' }
]
const ACCS = [
  { text: '♮', callback_data: 'acc:' },
  { text: '♭', callback_data: 'acc:b' },
  { text: '♯', callback_data: 'acc:#' },
]

function nColumn(buttons, n) {
  const keyboard = []
  for (let i = 0; i < buttons.length; i += n) {
    keyboard.push(buttons.slice(i, i + n))
  }
  return keyboard
}

function twoColumn(arr) {
  return nColumn(arr, 2)
}

function threeColumn(arr) {
  return nColumn(arr, 3)
}

function getQuickRow(lng) {
  return [
    { text: t('buttons.help', { lng }), callback_data: 'show_help' },
    { text: t('buttons.cancel', { lng }), callback_data: 'quick_cancel' },
    { text: t('buttons.lang', { lng }), callback_data: 'show_lang' }
  ]
}

function getRootKeyboard(lng, nCols = 3) {
  const btns = ROOTS.map(r => ({ text: r, callback_data: `root:${r}` }))
  return nColumn(btns, nCols)
}

module.exports = {
  ROOTS,
  TYPES,
  ACCS,
  nColumn,
  twoColumn,
  threeColumn,
  getQuickRow,
  getRootKeyboard,
}
