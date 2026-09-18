import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("etoken");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsAuthLoading(false);
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem("etoken", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("etoken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};