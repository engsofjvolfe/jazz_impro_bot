// src/handlers/callbacks.js

const {
  handleRestart,
  handleShowHelp,
  handleQuickCancel,
  handleShowLang,
  handleSetLang
} = require('./flow/quickActions');

const { t, detectLang } = require('../i18n');

const {
  handleBackToRoot,
  handleBackToType
} = require('./flow/backNavigation');

const { handleRootStep } = require('./flow/handleRoot');
const { handleTypeStep } = require('./flow/handleType');
const { handleAccStep } = require('./flow/handleAccidental');

async function handleCallback(query, bot, state, resetTimeout) {
  const chatId = query.message.chat.id;
  const lng = detectLang(query.message);

  if (query.data === 'restart') return handleRestart(query, bot, state, resetTimeout);
  if (query.data === 'show_help') return handleShowHelp(query, bot, state);
  if (query.data === 'quick_cancel') return handleQuickCancel(query, bot, state);
  if (query.data === 'show_lang') return handleShowLang(query, bot, state);
  if (query.data.startsWith('set_lang:')) return handleSetLang(query, bot, state, resetTimeout);
  if (query.data === 'back:root') return handleBackToRoot(query, bot, state);
  if (query.data === 'back:type') return handleBackToType(query, bot, state);

  if (!state[chatId]) {
    return bot.sendMessage(chatId, t('errors.session_expired_restart', { lng }));
  }

  try {
    const [step] = query.data.split(':');
    if (step === 'root') return handleRootStep(query, bot, state, resetTimeout);
    if (step === 'type') return handleTypeStep(query, bot, state, resetTimeout);
    if (step === 'acc') return handleAccStep(query, bot, state);
  } catch (err) {
    console.error(err);
    bot.sendMessage(query.message.chat.id, t('errors.generic', { lng }));
  }
}

module.exports = { handleCallback };
