import { createContext, useState, useEffect, ReactNode } from "react";
import { authAPI, initMockData } from "../services/mockApi";

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initMockData();

    // Check if user is logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.error };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Đã xảy ra lỗi khi đăng nhập" };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authAPI.register(fullName, email, password);

      if (response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, message: response.error };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Đã xảy ra lỗi khi đăng ký" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
