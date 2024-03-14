import React, { createContext, useEffect, useState } from 'react';

// Crea el contexto con un valor inicial
export const ShowNoeContext = createContext({
  showNoe: false,
  setShowNoe: () => {},
});

export const ShowNoesProvider = ({ children }) => {
  const [showNoe, setShowNoe] = useState(localStorage.getItem('showNoe') ?? false);

  useEffect(() => {
    localStorage.setItem('showNoe', showNoe.toString() ?? false);
  }, [showNoe]);

  return <ShowNoeContext.Provider value={{ showNoe, setShowNoe }}>{children}</ShowNoeContext.Provider>;
};
