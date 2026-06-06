import { useState, useEffect, type ReactNode } from 'react';
import { storage } from '../utils/storage';
import { AuthContext, type User } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    storage.get<User | null>('currentUser', null),
  );
  const [token, setToken] = useState<string | null>(() =>
    storage.get<string | null>('authToken', null),
  );
  const [isLoading] = useState(false);

  useEffect(() => {
    function handleLogin() {
      const savedUser = storage.get<User | null>('currentUser', null);
      const savedToken = storage.get<string | null>('authToken', null);
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
    }

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    storage.set('currentUser', newUser);
    storage.set('authToken', newToken);
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
