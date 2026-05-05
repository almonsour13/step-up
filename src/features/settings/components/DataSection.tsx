import { activityService } from "@/shared/services/storage/activity.service";
import { StorageService } from "@/shared/services/storage/storage.service";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { DEFAULT_SETTINGS } from "@/shared/types/type";
import { useRouter } from "expo-router";
import { Alert, ToastAndroid } from "react-native";
import Section, { SettingsSection } from "./ui/Section";

export default function DataSection() {
    const router = useRouter();
    const clearActivities = useActivityStore((s) => s.clearActivities);
    const setProfile = useProfileStore((s) => s.setProfile);
    const setSettings = useSettingsStore((s) => s.setSettings);

    const confirmClearData = () =>
        Alert.alert(
            "Clear Activity Data",
            "This will permanently delete all your activity history. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await activityService.clear();
                        clearActivities();
                        ToastAndroid.show(
                            "Activity data cleared",
                            ToastAndroid.SHORT,
                        );
                    },
                },
            ],
        );

    const confirmResetStorage = () =>
        Alert.alert(
            "Reset All Data",
            "This will delete your profile, settings, and all activity history. You'll be taken back to onboarding. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        await StorageService.resetAll();
                        setProfile(null);
                        setSettings(DEFAULT_SETTINGS);
                        router.replace("/onboarding");
                    },
                },
            ],
        );

    const section: SettingsSection = {
        title: "Data",
        items: [
            {
                label: "Clear Activity Data",
                description: "Permanently delete all recorded sessions",
                icon: "trash-outline" as const,
                value: undefined,
                onPress: confirmClearData,
                type: "danger",
            },
            {
                label: "Reset All Data",
                description: "Wipe profile, settings, and activity history",
                icon: "nuclear-outline" as const,
                value: undefined,
                onPress: confirmResetStorage,
                type: "danger",
            },
        ],
    };

    return <Section section={section} />;
}
