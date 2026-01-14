/**
 * Player Data Management (Persistent)
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerData } from '../types';

interface PlayerStore extends PlayerData {
  // アクション
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  upgradeLevel: (upgradeId: string) => boolean;
  purchaseUpgrade: (upgradeId: string, cost: number) => boolean;
  updateHighScore: (score: number) => void;
  setLanguage: (lang: 'en' | 'ja') => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptic: () => void;
  resetData: () => void;
}

const STORAGE_KEY = '@DungeonStack:PlayerData';

const initialData: PlayerData = {
  totalCoins: 0,
  highScore: 0,
  upgrades: {},
  settings: {
    language: 'en',
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
  },
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialData,

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (error) {
      console.error('Failed to load player data:', error);
    }
  },

  saveData: async () => {
    try {
      const data = get();
      const { loadData, saveData, ...persistData } = data;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
    } catch (error) {
      console.error('Failed to save player data:', error);
    }
  },

  addCoins: (amount) => {
    set((state) => ({
      totalCoins: state.totalCoins + amount,
    }));
    get().saveData();
  },

  spendCoins: (amount) => {
    const { totalCoins } = get();
    if (totalCoins >= amount) {
      set({ totalCoins: totalCoins - amount });
      get().saveData();
      return true;
    }
    return false;
  },

  upgradeLevel: (upgradeId) => {
    const { upgrades } = get();
    const currentLevel = upgrades[upgradeId] || 0;
    set({
      upgrades: {
        ...upgrades,
        [upgradeId]: currentLevel + 1,
      },
    });
    get().saveData();
    return true;
  },

  purchaseUpgrade: (upgradeId, cost) => {
    const success = get().spendCoins(cost);
    if (success) {
      get().upgradeLevel(upgradeId);
      return true;
    }
    return false;
  },

  updateHighScore: (score) => {
    const { highScore } = get();
    if (score > highScore) {
      set({ highScore: score });
      get().saveData();
    }
  },

  setLanguage: (lang) => {
    set((state) => ({
      settings: { ...state.settings, language: lang },
    }));
    get().saveData();
  },

  toggleSound: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: !state.settings.soundEnabled,
      },
    }));
    get().saveData();
  },

  toggleMusic: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        musicEnabled: !state.settings.musicEnabled,
      },
    }));
    get().saveData();
  },

  toggleHaptic: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        hapticEnabled: !state.settings.hapticEnabled,
      },
    }));
    get().saveData();
  },

  resetData: () => {
    set(initialData);
    get().saveData();
  },
}));
