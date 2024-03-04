import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let loggedIn = "authToken" in window.localStorage ? true : false
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  const login = (token) => {
    window.localStorage.setItem("authToken", token)
    setIsLoggedIn(true);
  };

  const logout = () => {
    window.localStorage.clear()
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};