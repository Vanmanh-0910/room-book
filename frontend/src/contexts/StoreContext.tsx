import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ODDStore, getCurrentUser } from '../store';
import { User } from '../data';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface StoreContextType {
  currentUser: User | null;
  login: (username: string, password?: string) => { success: boolean; code?: string; message?: string; user?: User };
  logout: () => void;
  switchRole: (role: string) => void;
  addToast: (message: string, type?: 'info' | 'success' | 'warn' | 'error', duration?: number) => void;
  removeToast: (id: number) => void;
  toasts: ToastMessage[];
  resetStore: () => void;
  store: typeof ODDStore;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshUser = useCallback(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const login = useCallback(
    (username: string, password?: string) => {
      const result = ODDStore.login(username, password);
      if (result.success) {
        refreshUser();
      }
      return result;
    },
    [refreshUser]
  );

  const logout = useCallback(() => {
    ODDStore.logout();
    setCurrentUser(null);
  }, []);

  const switchRole = useCallback(
    (role: string) => {
      const roleMap: Record<string, { username: string; password: string }> = {
        guest: { username: 'guest.demo', password: '123' },
        host: { username: 'host.demo', password: '123' },
        admin: { username: 'admin', password: '123' },
      };
      if (role === 'logout') {
        logout();
        return;
      }
      const creds = roleMap[role];
      if (creds) {
        ODDStore.login(creds.username, creds.password);
        refreshUser();
      }
    },
    [logout, refreshUser]
  );

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info', duration: number = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const resetStore = useCallback(() => {
    ODDStore.reset();
    refreshUser();
    addToast('Đã khôi phục CSDL về dữ liệu mẫu ban đầu.', 'success');
  }, [refreshUser, addToast]);

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        addToast,
        removeToast,
        toasts,
        resetStore,
        store: ODDStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export default StoreContext;
