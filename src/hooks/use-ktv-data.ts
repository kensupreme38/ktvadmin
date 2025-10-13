
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Ktv } from '@/types';
import { initialKtvs } from '@/data/ktvs';

const KTV_STORAGE_KEY = 'ktv_data';

// Use BroadcastChannel for more reliable cross-tab communication
const channel = typeof window !== 'undefined' ? new BroadcastChannel('ktv_data_channel') : null;

export const useKtvData = () => {
  const [ktvs, setKtvs] = useState<Ktv[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    try {
      const item = window.localStorage.getItem(KTV_STORAGE_KEY);
      if (item) {
        setKtvs(JSON.parse(item));
      } else {
        const initialData = initialKtvs;
        setKtvs(initialData);
        window.localStorage.setItem(KTV_STORAGE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${KTV_STORAGE_KEY}”:`, error);
      setKtvs(initialKtvs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to load data on initial mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Effect to listen for changes from other tabs/windows via BroadcastChannel
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'update') {
        loadData();
      }
    };
    
    channel?.addEventListener('message', handleMessage);
    
    return () => {
      channel?.removeEventListener('message', handleMessage);
    };
  }, [loadData]);

  const saveData = useCallback((data: Ktv[]) => {
    try {
      const stringifiedData = JSON.stringify(data);
      window.localStorage.setItem(KTV_STORAGE_KEY, stringifiedData);
      // Notify other tabs about the update
      channel?.postMessage('update');
      // Update current tab's state
      setKtvs(data);
    } catch (error) {
      console.warn(`Error setting localStorage key “${KTV_STORAGE_KEY}”:`, error);
    }
  }, []);

  const addKtv = useCallback((newKtv: Ktv) => {
    const newKtvs = [newKtv, ...ktvs];
    saveData(newKtvs);
  }, [ktvs, saveData]);

  const updateKtv = useCallback((id: string, updatedKtvData: Partial<Ktv>) => {
    const newKtvs = ktvs.map((ktv) => (ktv.id === id ? { ...ktv, ...updatedKtvData } : ktv));
    saveData(newKtvs);
  }, [ktvs, saveData]);

  const deleteKtv = useCallback((id: string) => {
    const newKtvs = ktvs.filter((ktv) => ktv.id !== id);
    saveData(newKtvs);
  }, [ktvs, saveData]);

  return { ktvs, addKtv, updateKtv, deleteKtv, isLoading };
};
