import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const responseData = response.data?.data;

    const newToken = responseData?.token;
    const newUser = responseData?.user;

    if (!newToken) {
      throw new Error("Login token was not returned by the server");
    }

    setToken(newToken);
    setTokenState(newToken);

    if (newUser) {
      setUser(newUser);
      setUserState(newUser);
    }

    return response.data;
  }

  async function register(name, email, password) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  }

  function logout() {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}