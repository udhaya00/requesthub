import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, loginUser, signupUser } from "../api/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "srh_token";
const USER_KEY = "srh_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(sessionStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        sessionStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch (error) {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const persistSession = (session) => {
    sessionStorage.setItem(TOKEN_KEY, session.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setUser(session.user);
  };

  const login = async (payload) => {
    const session = await loginUser(payload);
    persistSession(session);
    return session.user;
  };

  const signup = async (payload) => {
    const session = await signupUser(payload);
    persistSession(session);
    return session.user;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
