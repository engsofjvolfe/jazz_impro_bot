// src/handlers/callbacks.js

const {
  handleRestart,
  handleShowHelp,
  handleQuickCancel,
  handleShowLang,
  handleSetLang
} = require('./flow/quickActions');

const {
  handleBackToRoot,
  handleBackToType
} = require('./flow/backNavigation');

const { handleRootStep } = require('./flow/handleRoot');
const { handleTypeStep } = require('./flow/handleType');
const { handleAccStep } = require('./flow/handleAccidental');
const { t, detectLang } = require('../i18n');

async function handleCallback(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;

  if (query.data === 'restart') return handleRestart(query, bot, state, resetTimeout);
  if (query.data === 'show_help') return handleShowHelp(query, bot);
  if (query.data === 'quick_cancel') return handleQuickCancel(query, bot, state);
  if (query.data === 'show_lang') return handleShowLang(query, bot);
  if (query.data.startsWith('lang:')) return handleSetLang(query, bot, state);
  if (query.data === 'back:root') return handleBackToRoot(query, bot, state);
  if (query.data === 'back:type') return handleBackToType(query, bot, state);

  if (!state[chatId]) {
    const lng = detectLang(query.message);
    return bot.sendMessage(chatId, t('callbacks.expired', { lng }));
  }

  try {
    const [step] = query.data.split(':');
    if (step === 'root') return handleRootStep(query, bot, state, resetTimeout);
    if (step === 'type') return handleTypeStep(query, bot, state, resetTimeout);
    if (step === 'acc') return handleAccStep(query, bot, state);
  } catch (err) {
    console.error(err);
    const lng = detectLang(query.message);
    bot.sendMessage(query.message.chat.id, t('callbacks.error', { lng }));
  }
}

module.exports = { handleCallback };
