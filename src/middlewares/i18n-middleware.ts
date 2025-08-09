import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fs from 'fs';
import config from '../config';

function getNamespaces(localePath: string): string[] {
  const files = fs.readdirSync(localePath);
  return files.map(file => path.parse(file).name);
}

const localeDir = path.join(__dirname, '../locales/en');
const namespaces = [...getNamespaces(localeDir), 'validation'];

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: config.defaultLanguage,
    preload: ['en', 'ar'],
    ns: namespaces,
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    defaultNS: 'common',
  });

export default middleware.handle(i18next);
