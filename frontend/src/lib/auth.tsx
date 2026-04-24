"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";

export interface User {
  name: string;
  avatar: string;
  createdAt: string;
  bio?: string;
  vibe?: string;
  hobbies?: string[];
  gender?: string;
}

const USER_KEY = "synch_user";
const SESSION_KEY = "synch_session";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function getAvatarUrl(name: string): string {
  const seed = name.replace(/\s+/g, "");
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function createUser(name: string): User {
  return {
    name,
    avatar: getAvatarUrl(name),
    createdAt: new Date().toISOString(),
  };
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_KEY, "true");
}

export function clearSession(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SESSION_KEY) === "true";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (name: string) => {
    const newUser = createUser(name);
    saveUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}