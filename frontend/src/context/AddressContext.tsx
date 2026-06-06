import { useCallback, useState, type ReactNode } from 'react';
import type { DeliveryAddress } from '../types';
import { storage } from '../utils/storage';
import { AddressContext, STORAGE_KEY } from './AddressContextCore';

function readFromStorage(): DeliveryAddress | null {
  const parsed = storage.get<unknown>(STORAGE_KEY, null);
  if (
    parsed !== null &&
    typeof parsed === 'object' &&
    'text' in parsed &&
    'setAt' in parsed &&
    typeof (parsed as DeliveryAddress).text === 'string' &&
    typeof (parsed as DeliveryAddress).setAt === 'string'
  ) {
    return parsed as DeliveryAddress;
  }
  return null;
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<DeliveryAddress | null>(
    readFromStorage,
  );

  const setAddress = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const value: DeliveryAddress = {
      text: trimmed,
      setAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEY, value);
    setAddressState(value);
  }, []);

  const clearAddress = useCallback(() => {
    storage.remove(STORAGE_KEY);
    setAddressState(null);
  }, []);

  return (
    <AddressContext.Provider value={{ address, setAddress, clearAddress }}>
      {children}
    </AddressContext.Provider>
  );
}
