import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { CurrencyRateProvider } from './context/currency_rate';
import { ShowNoesProvider } from 'context/show_noe';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrencyRateProvider>
        <ShowNoesProvider>
          <App />
        </ShowNoesProvider>
      </CurrencyRateProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
