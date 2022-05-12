import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import express from 'express';
import Backend from 'i18next-node-fs-backend';
import path from 'path';

//#region express settings
const __dirname = path.resolve(path.dirname(''));

i18next
  .use(Backend)
  //.use(middleware.LanguageDetector)
  .init({
    preload: ['en', 'tr'],
    backend: {
      loadPath: __dirname + '/resources/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'en',
  });

var app = express();

app.use(
  middleware.handle(i18next, {
    ignoreRoutes: ['/foo'], // or function(req, res, options, i18next) { /* return true to ignore */ }
  })
);

// in your request handler
app.get('/greeting', (req, res) => {
  var lng = req.language; // 'de-CH'
  var lngs = req.languages; // ['de-CH', 'de', 'en']
  console.log('lng', lng);
  console.log('lngs', lngs);
  req.i18n.changeLanguage('tr'); // will not load that!!! assert it was preloaded
  console.log('lng', lng);
  console.log('lngs', lngs);

  var exists = req.i18n.exists('greeting');
  var translation = req.t('greeting');

  const response = req.t('greeting');
  res.status(200);
  res.send(response);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));
