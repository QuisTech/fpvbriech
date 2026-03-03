import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'guest';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: 'admin' | 'student') => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (mock persistence)
    const savedUser = localStorage.getItem('briech-uas-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: 'admin' | 'student') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      name: email.split('@')[0] || 'User'
    };
    
    setUser(newUser);
    localStorage.setItem('briech-uas-user', JSON.stringify(newUser));
    setLoading(false);
  };

  const loginAsGuest = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const guestUser: User = {
      id: 'guest-123',
      email: 'guest@example.com',
      role: 'guest',
      name: 'Guest User'
    };
    
    setUser(guestUser);
    localStorage.setItem('briech-uas-user', JSON.stringify(guestUser));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('briech-uas-user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
