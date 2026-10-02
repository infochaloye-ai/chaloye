import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock customer auth. Swap these functions for supabase.auth.* when the backend is connected.

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  joinDate: string;
}

interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (input: SignupInput) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (patch: Partial<User>) => Promise<boolean>;
}

const USER_KEY = 'chaloye-user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  };

  const login = async (email: string, password: string) => {
    await wait(600);
    if (!email || !password) return false;
    const name = email.split('@')[0].replace(/[._-]+/g, ' ');
    const [first = 'Trekker', ...rest] = name.split(' ');
    persist({
      id: email,
      email,
      firstName: first.charAt(0).toUpperCase() + first.slice(1),
      lastName: rest.join(' '),
      joinDate: new Date().toISOString().slice(0, 10),
    });
    return true;
  };

  const signup = async (input: SignupInput) => {
    await wait(600);
    persist({
      id: input.email,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      joinDate: new Date().toISOString().slice(0, 10),
    });
    return true;
  };

  const logout = () => persist(null);

  const resetPassword = async () => {
    await wait(600);
    return true;
  };

  const updateProfile = async (patch: Partial<User>) => {
    if (!user) return false;
    await wait(400);
    persist({ ...user, ...patch });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
