
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Ktv } from '@/types';
import { initialKtvs } from '@/data/ktvs';

const KTV_STORAGE_KEY = 'ktv_data';

// Helper function to safely get data from localStorage
const getInitialData = (): Ktv[] => {
  if (typeof window === 'undefined') {
    return initialKtvs;
  }
  try {
    const item = window.localStorage.getItem(KTV_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    } else {
      // If no data in localStorage, initialize it with the default data
      window.localStorage.setItem(KTV_STORAGE_KEY, JSON.stringify(initialKtvs));
      return initialKtvs;
    }
  } catch (error) {
    console.warn(`Error reading localStorage key “${KTV_STORAGE_KEY}”:`, error);
    return initialKtvs;
  }
};

export const useKtvData = () => {
  const [ktvs, setKtvs] = useState<Ktv[]>(getInitialData);

  // Effect to update localStorage whenever `ktvs` state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(KTV_STORAGE_KEY, JSON.stringify(ktvs));
    } catch (error) {
      console.warn(`Error setting localStorage key “${KTV_STORAGE_KEY}”:`, error);
    }
  }, [ktvs]);

  // Effect to listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === KTV_STORAGE_KEY && event.newValue) {
        setKtvs(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addKtv = useCallback((newKtv: Ktv) => {
    setKtvs((prevKtvs) => [newKtv, ...prevKtvs]);
  }, []);

  const updateKtv = useCallback((id: string, updatedKtv: Partial<Ktv>) => {
    setKtvs((prevKtvs) =>
      prevKtvs.map((ktv) => (ktv.id === id ? { ...ktv, ...updatedKtv } : ktv))
    );
  }, []);

  const deleteKtv = useCallback((id: string) => {
    setKtvs((prevKtvs) => prevKtvs.filter((ktv) => ktv.id !== id));
  }, []);

  return { ktvs, addKtv, updateKtv, deleteKtv };
};
