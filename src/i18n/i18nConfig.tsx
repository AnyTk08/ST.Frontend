import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import {language} from 'config/AppConfig'
import {en,th} from './language'
const resources = {
    en: en,
    th: th
};

i18n.use(initReactI18next).init({ resources, lng: language, interpolation: { escapeValue: false } });
export default i18n;