'use client';

import React, { createContext, ReactNode, useState } from 'react';

type AuthContextType = {
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  
  const login = (userData: any) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value: AuthContextType = {
    user,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 