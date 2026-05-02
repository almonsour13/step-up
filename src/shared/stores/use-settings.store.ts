import { DEFAULT_SETTINGS, Settings } from "@/shared/types/type";
import { create } from "zustand";
import { settingsService } from "../services/storage/settings.storage.service";

type SettingsStore = {
    settings: Settings;
    setSettings: (settings: Settings) => void;
    updateSettings: (partial: Partial<Settings>) => Promise<void>;
    setTheme: (theme: Settings["theme"]) => Promise<void>;
    setUnits: (units: Settings["units"]) => Promise<void>;
    setStepGoal: (stepGoal: Settings["stepGoal"]) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    settings: DEFAULT_SETTINGS,

    setSettings: (settings) => set({ settings }),

    updateSettings: async (partial) => {
        set((state) => ({ settings: { ...state.settings, ...partial } }));
        await settingsService.updateSettings(partial);
    },

    setTheme: async (theme) => {
        get().updateSettings({ theme });
    },

    setUnits: async (units) => {
        get().updateSettings({ units });
    },

    setStepGoal: async (stepGoal) => {
        get().updateSettings({ stepGoal });
    },
}));
