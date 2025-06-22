const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const { state } = require('./session');

function detectLang(msg) {
  return state[msg.chat.id]?.prefs?.lang || msg.from.language_code || 'en';
}

i18next
  .use(Backend)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    returnEmptyString: false,
    preload: ['en', 'pt'],
    backend: {
      loadPath: path.join(__dirname, '..', 'locales/{{lng}}/translation.json')
    }
  });

module.exports = { t: i18next.t.bind(i18next), detectLang };
