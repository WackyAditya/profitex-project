import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const getStoredUser = () => {
    const stored = localStorage.getItem("user");

    if (!stored || stored === "undefined") {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch (err) {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
