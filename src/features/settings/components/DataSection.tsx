import { activityService } from "@/shared/services/storage/activity.service";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { Alert, ToastAndroid } from "react-native";
import Section, { SettingsSection } from "./ui/Section";

export default function DataSection() {
    const clearActivities = useActivityStore((s) => s.clearActivities);

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
                        // Clear data
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

    const section: SettingsSection = {
        title: "Data",
        items: [
            {
                label: "Clear Activity Data",
                description: "Delete all recorded sessions",
                icon: "trash-outline" as const,
                value: undefined,
                onPress: confirmClearData,
                type: "danger",
            },
        ],
    };
    return <Section section={section} />;
}
