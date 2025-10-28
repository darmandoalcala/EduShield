import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [highPrecision, setHighPrecision] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);

  const updateLocationSettings = async (settings) => {
    try {
      // conecta con backend mapaRealTime.js
      await fetch('https://literate-cod-4jj5vrppq4x43w97-3001.app.github.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locationEnabled,
        setLocationEnabled,
        highPrecision,
        setHighPrecision,
        historyEnabled,
        setHistoryEnabled,
        shareLocation,
        setShareLocation,
        updateLocationSettings,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
