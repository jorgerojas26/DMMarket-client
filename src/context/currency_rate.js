import React, { useState } from 'react';

export const CurrencyRateContext = React.createContext();

export const CurrencyRateProvider = ({ children }) => {
  const [currencyRate, setCurrencyRate] = useState(0);

  return (
    <CurrencyRateContext.Provider value={{ currencyRate, setCurrencyRate }}>{children}</CurrencyRateContext.Provider>
  );
};
