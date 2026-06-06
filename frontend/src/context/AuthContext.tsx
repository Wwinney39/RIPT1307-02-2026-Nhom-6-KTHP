import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

interface User {
  user_id: number;
  name: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.get<User | null>('currentUser', null);
    const savedToken = storage.get<string | null>('authToken', null);

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setIsLoading(false);

    function handleLogin() {
      const user = storage.get<User | null>('currentUser', null);
      const token = storage.get<string | null>('authToken', null);
      if (user && token) {
        setUser(user);
        setToken(token);
      }
    }

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    storage.set('currentUser', user);
    storage.set('authToken', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove('currentUser');
    storage.remove('authToken');
    storage.remove('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
