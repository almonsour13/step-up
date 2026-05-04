import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useEffect, useState } from "react";
import { profileService } from "../services/storage/profile.services";
import { settingsService } from "../services/storage/settings.service";
import { useSettingsStore } from "../stores/use-settings.store";

export const useAppInit = () => {
    const [ready, setReady] = useState(false);

    const setProfile = useProfileStore((s) => s.setProfile);
    const setSettings = useSettingsStore((s) => s.setSettings);

    useEffect(() => {
        const init = async () => {
            try {
                // activityStorageService.clear();
                const [profile, settings] = await Promise.all([
                    profileService.getProfile(),
                    settingsService.getSettings(),
                ]);

                setProfile(profile);
                setSettings(settings);
            } catch (e) {
                console.error("[useAppInit] Failed to load app data:", e);
            } finally {
                setReady(true);
            }
        };

        init();
    }, []);

    return { ready };
};
