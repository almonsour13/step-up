import { logger } from "@/shared/utils/logger";
import { generateId } from "@/shared/utils/utils";
import { STORAGE_KEYS } from "../../constants/constant";
import { Profile } from "../../types/type";
import { StorageService } from "./storage.service";

class ProfileService {
    private profileStore = new StorageService<Profile>(STORAGE_KEYS.PROFILE);

    async getProfile(): Promise<Profile | null> {
        logger.log("[ProfileService] getProfile → start");

        try {
            const profile = await this.profileStore.get();

            logger.log(
                "[ProfileService] getProfile → result:",
                profile ? "FOUND" : "NULL",
            );

            return profile;
        } catch (error) {
            logger.error("[ProfileService] getProfile → error:", error);
            throw error;
        }
    }

    async saveProfile(profile: Profile): Promise<Profile | null> {
        logger.log("[ProfileService] saveProfile → start");

        try {
            const id = generateId();
            const createdAt = new Date().toISOString();

            const payload = {
                ...profile,
                id,
                createdAt,
            };

            logger.log("[ProfileService] saveProfile → payload:", {
                name: payload.name,
                id,
            });

            await this.profileStore.set(payload);

            logger.log("[ProfileService] saveProfile → success");

            return await this.getProfile();
        } catch (error) {
            logger.error("[ProfileService] saveProfile → error:", error);
            throw error;
        }
    }

    async updateProfile(updates: Partial<Profile>): Promise<Profile> {
        logger.log("[ProfileService] updateProfile → start");

        try {
            const current = await this.getProfile();

            if (!current) {
                logger.warn(
                    "[ProfileService] updateProfile → no profile found",
                );
                throw new Error("No profile found to update");
            }

            const updatedProfile: Profile = {
                ...current,
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            logger.log(
                "[ProfileService] updateProfile → updating fields:",
                Object.keys(updates),
            );

            await this.profileStore.set(updatedProfile);

            logger.log("[ProfileService] updateProfile → success");

            return updatedProfile;
        } catch (error) {
            logger.error("[ProfileService] updateProfile → error:", error);
            throw error;
        }
    }

    async deleteProfile(): Promise<void> {
        logger.log("[ProfileService] deleteProfile → start");

        try {
            await this.profileStore.remove();

            logger.log("[ProfileService] deleteProfile → success");
        } catch (error) {
            logger.error("[ProfileService] deleteProfile → error:", error);
            throw error;
        }
    }

    async isProfileSetup(): Promise<boolean> {
        logger.log("[ProfileService] isProfileSetup → checking");

        try {
            const profile = await this.getProfile();
            const result = !!profile;

            logger.log("[ProfileService] isProfileSetup → result:", result);

            return result;
        } catch (error) {
            logger.error("[ProfileService] isProfileSetup → error:", error);
            throw error;
        }
    }
}

export const profileService = new ProfileService();
