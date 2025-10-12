
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Ktv } from '@/types';
import { initialKtvs } from '@/data/ktvs';

const KTV_STORAGE_KEY = 'ktv_data';

export const useKtvData = () => {
  const [ktvs, setKtvs] = useState<Ktv[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load data from localStorage on client-side mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(KTV_STORAGE_KEY);
      if (item) {
        setKtvs(JSON.parse(item));
      } else {
        // If no data, initialize with default and set it in localStorage
        setKtvs(initialKtvs);
        window.localStorage.setItem(KTV_STORAGE_KEY, JSON.stringify(initialKtvs));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${KTV_STORAGE_KEY}”:`, error);
      setKtvs(initialKtvs); // Fallback to initial data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to update localStorage whenever `ktvs` state changes, but only after initial load
  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(KTV_STORAGE_KEY, JSON.stringify(ktvs));
      } catch (error) {
        console.warn(`Error setting localStorage key “${KTV_STORAGE_KEY}”:`, error);
      }
    }
  }, [ktvs, isLoading]);

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

  return { ktvs, addKtv, updateKtv, deleteKtv, isLoading };
};
