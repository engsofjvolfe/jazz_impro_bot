const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const { state } = require('./session');

i18next
  .use(Backend)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    preload: ['en', 'pt'],
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json')
    }
  });

function detectLang(msg) {
  return state[msg.chat.id]?.lang || msg.from.language_code || 'en';
}

const { t } = i18next;

module.exports = { t, detectLang };
