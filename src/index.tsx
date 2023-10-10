import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {AppTitle} from 'config/AppConfig'
import './index.css';
import 'config/i18nConfig';
import App from './App';
(async function () {

   document.title =AppTitle
   const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
   const container = document.getElementById('root');
   const root = createRoot(container);
   root.render(
     <BrowserRouter basename={baseUrl} >
       < App />
     </BrowserRouter>
   );
 })();