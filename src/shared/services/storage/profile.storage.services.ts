import { STORAGE_KEYS } from "../../constants/constant";
import { Profile } from "../../types/type";
import { StorageService } from "./storage.service";

class ProfileService {
    private profileStore = new StorageService<Profile>(STORAGE_KEYS.PROFILE);

    async getProfile(): Promise<Profile | null> {
        return await this.profileStore.get();
    }

    async saveProfile(profile: Profile): Promise<void> {
        await this.profileStore.set(profile);
    }

    async updateProfile(updates: Partial<Profile>): Promise<Profile> {
        const current = await this.getProfile();
        if (!current) {
            throw new Error("No profile found to update");
        }

        const updatedProfile: Profile = {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        await this.profileStore.set(updatedProfile);
        return updatedProfile;
    }

    async deleteProfile(): Promise<void> {
        await this.profileStore.remove();
    }

    async isProfileSetup(): Promise<boolean> {
        const profile = await this.getProfile();
        return !!profile;
    }
}

export const profileService = new ProfileService();
