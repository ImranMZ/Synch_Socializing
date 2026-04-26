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
  age?: number;
  city?: string;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  ageRangeMin?: number;
  ageRangeMax?: number;
}

const USER_KEY = "synch_user";
const SESSION_KEY = "synch_session";
const SETTINGS_KEY = "synch_settings";
const MATCHES_HISTORY_KEY = "synch_matches";
const ACTIVITY_KEY = "synch_activity";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function getAvatarUrl(name: string): string {
  const seed = name.replace(/\s+/g, "");
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function createUser(name: string, gender?: string, age?: number, city?: string): User {
  return {
    name,
    avatar: getAvatarUrl(name),
    createdAt: new Date().toISOString(),
    gender,
    age,
    city,
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

// Settings functions
export function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return { darkMode: false, notifications: true };
  const settingsStr = localStorage.getItem(SETTINGS_KEY);
  return settingsStr ? JSON.parse(settingsStr) : { darkMode: false, notifications: true };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Match history functions
export interface MatchHistoryItem {
  id: string;
  name: string;
  avatar: string;
  vibe: string;
  score: number;
  action: "liked" | "skipped" | "connected";
  date: string;
}

export function getMatchHistory(): MatchHistoryItem[] {
  if (typeof window === "undefined") return [];
  const historyStr = localStorage.getItem(MATCHES_HISTORY_KEY);
  return historyStr ? JSON.parse(historyStr) : [];
}

export function addToMatchHistory(item: MatchHistoryItem): void {
  const history = getMatchHistory();
  history.unshift(item);
  localStorage.setItem(MATCHES_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

// Activity functions
export interface ActivityItem {
  id: string;
  type: "new_match" | "viewed" | "similar" | "system";
  title: string;
  message: string;
  avatar?: string;
  date: string;
  read: boolean;
}

export function getActivity(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  const activityStr = localStorage.getItem(ACTIVITY_KEY);
  return activityStr ? JSON.parse(activityStr) : [];
}

export function addActivity(item: Omit<ActivityItem, "id" | "date" | "read">): void {
  const activity = getActivity();
  activity.unshift({
    ...item,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    read: false,
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(0, 50)));
}

export function markActivityRead(id: string): void {
  const activity = getActivity();
  const updated = activity.map(a => a.id === id ? { ...a, read: true } : a);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
}

export function clearActivity(): void {
  localStorage.removeItem(ACTIVITY_KEY);
}

// Context
interface AuthContextType {
  user: User | null;
  settings: AppSettings;
  loading: boolean;
  login: (name: string, gender?: string, age?: number, city?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  ageRangeMin: 18,
  ageRangeMax: 35,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  settings: defaultSettings,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  updateSettings: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedSettings = getStoredSettings();
    setUser(storedUser);
    setSettings(storedSettings);
    
    // Apply dark mode
    if (storedSettings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setLoading(false);
  }, []);

  const login = (name: string, gender?: string, age?: number, city?: string) => {
    const newUser = createUser(name, gender, age, city);
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

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    saveSettings(newSettings);
    setSettings(newSettings);
    
    // Apply dark mode immediately
    if (updates.darkMode !== undefined) {
      if (updates.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, settings, loading, login, logout, updateUser, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}