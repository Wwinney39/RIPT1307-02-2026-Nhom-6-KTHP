import { createContext, useContext } from 'react';
import type { Toast } from '../types';

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export default function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
