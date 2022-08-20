import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { CurrencyRateProvider } from './context/currency_rate';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrencyRateProvider>
        <App />
      </CurrencyRateProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
