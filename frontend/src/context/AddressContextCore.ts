import { createContext, useContext } from 'react';
import type { DeliveryAddress } from '../types';

export interface AddressContextValue {
  address: DeliveryAddress | null;
  setAddress: (text: string) => void;
  clearAddress: () => void;
}

export const AddressContext = createContext<AddressContextValue | null>(null);
export const STORAGE_KEY = 'deliveryAddress';

export function useAddress(): AddressContextValue {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error('useAddress must be used inside <AddressProvider>');
  }
  return ctx;
}
