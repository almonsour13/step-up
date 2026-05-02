import { STORAGE_KEYS } from "../../constants/constant";
import { Settings } from "../../types/type";
import { StorageService } from "./storage.service";

class SettingsService {
    private settingsStore = new StorageService<Settings>(STORAGE_KEYS.SETTINGS);

    private readonly DEFAULT_SETTINGS: Settings = {
        theme: "system",
        units: "km",
        stepGoal: 6000,
        autoPause: false,
        notifications: true,
    };

    async getSettings(): Promise<Settings> {
        const settings = await this.settingsStore.get();
        return settings ?? this.DEFAULT_SETTINGS;
    }

    async updateSettings(updates: Partial<Settings>): Promise<Settings> {
        const current = await this.getSettings();
        const updated: Settings = {
            ...current,
            ...updates,
        };

        await this.settingsStore.set(updated);
        return updated;
    }

    async resetSettings(): Promise<Settings> {
        await this.settingsStore.set(this.DEFAULT_SETTINGS);
        return this.DEFAULT_SETTINGS;
    }
}

export const settingsService = new SettingsService();
