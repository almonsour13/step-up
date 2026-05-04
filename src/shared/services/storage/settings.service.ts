import { logger } from "@/shared/utils/logger";
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
        logger.log("[SettingsService] getSettings → start");

        try {
            const settings = await this.settingsStore.get();

            if (!settings) {
                logger.log("[SettingsService] getSettings → using DEFAULT");
                return this.DEFAULT_SETTINGS;
            }

            logger.log("[SettingsService] getSettings → loaded");

            return settings;
        } catch (error) {
            logger.error("[SettingsService] getSettings → error:", error);
            throw error;
        }
    }

    async updateSettings(updates: Partial<Settings>): Promise<Settings> {
        logger.log("[SettingsService] updateSettings → start");

        try {
            const current = await this.getSettings();

            const updated: Settings = {
                ...current,
                ...updates,
            };

            logger.log(
                "[SettingsService] updateSettings → fields:",
                Object.keys(updates),
            );

            await this.settingsStore.set(updated);

            logger.log("[SettingsService] updateSettings → success");

            return updated;
        } catch (error) {
            logger.error("[SettingsService] updateSettings → error:", error);
            throw error;
        }
    }

    async resetSettings(): Promise<Settings> {
        logger.warn("[SettingsService] resetSettings → resetting to DEFAULT");

        try {
            await this.settingsStore.set(this.DEFAULT_SETTINGS);

            logger.log("[SettingsService] resetSettings → success");

            return this.DEFAULT_SETTINGS;
        } catch (error) {
            logger.error("[SettingsService] resetSettings → error:", error);
            throw error;
        }
    }
}

export const settingsService = new SettingsService();
