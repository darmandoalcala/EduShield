// src/context/UserContext.js

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    console.log('👤 Usuario guardado en contexto:', userData);
    setUser(userData);
  };

  const logoutUser = () => {
    console.log('👋 Usuario cerró sesión');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    console.log('✏️ Usuario actualizado:', updatedData);
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};