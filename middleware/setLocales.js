const express = require('express');
const i18n = require('i18n');

const app = express();

i18n.configure({
  locales: ['en','hi'],
  directory: __dirname + '/../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  objectNotation: true
});

app.use(i18n.init);

const setLanguage = (req, res, next) => {
  const lang = req.headers['accept-language'];
    if (lang) {
        i18n.setLocale(lang);
    }
  next();
};

module.exports = setLanguage;