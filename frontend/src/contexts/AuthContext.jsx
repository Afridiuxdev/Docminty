"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, saveTokens, clearTokens } from "@/api/auth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem("docminty_access_token");
    if (token) {
      authApi.me()
        .then(res => setUser(res.data.data))
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: u } = res.data.data;
    saveTokens(accessToken, refreshToken);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (name, email, password, phone) => {
    const res = await authApi.signup({ name, email, password, phone });
    return res.data;
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    const res = await authApi.verifyOtp({ email, otp });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authApi.me();
    setUser(res.data.data);
    return res.data.data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOtp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default AuthContext;
