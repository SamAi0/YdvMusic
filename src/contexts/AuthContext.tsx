import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LocalUser, saveUser, getUser, removeUser } from '../utils/localData';

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAdmin(savedUser.isAdmin);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Simple validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      throw new Error('Password too short');
    }

    const newUser: LocalUser = {
      id: Date.now().toString(),
      email,
      fullName,
      isAdmin: email.includes('admin'), // Make admin if email contains 'admin'
      joinedDate: new Date().toISOString()
    };
    
    saveUser(newUser);
    setUser(newUser);
    setIsAdmin(newUser.isAdmin);
    toast.success('Account created successfully!');
  };

  const signIn = async (email: string, password: string) => {
    // Simple validation - in a real app, this would verify credentials
    if (!email || !password) {
      toast.error('Please enter email and password');
      throw new Error('Missing credentials');
    }

    const user: LocalUser = {
      id: Date.now().toString(),
      email,
      fullName: email.split('@')[0],
      isAdmin: email.includes('admin'),
      joinedDate: new Date().toISOString()
    };
    
    saveUser(user);
    setUser(user);
    setIsAdmin(user.isAdmin);
    toast.success('Signed in successfully!');
  };

  const signOut = async () => {
    removeUser();
    setUser(null);
    setIsAdmin(false);
    toast.success('Signed out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};