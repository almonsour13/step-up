import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { useEffect, useState } from "react";
import { profileService } from "../services/storage/profile.services";
import { settingsService } from "../services/storage/settings.service";

export const useAppInit = () => {
    const [ready, setReady] = useState(false);
    const [initError, setInitError] = useState(false);

    const setProfile = useProfileStore((s) => s.setProfile);
    const setSettings = useSettingsStore((s) => s.setSettings);

    useEffect(() => {
        const init = async () => {
            try {
                const [profile, settings] = await Promise.all([
                    profileService.get(),
                    settingsService.get(),
                ]);
                console.log("[useAppInit] App initialised");
                setProfile(profile);
                setSettings(settings);
            } catch (e) {
                console.error("[useAppInit] Failed to initialise app:", e);
                setInitError(true);
            } finally {
                setReady(true);
            }
        };

        init();
    }, []);

    return { ready, initError };
};
