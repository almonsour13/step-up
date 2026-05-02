import { Alert } from "react-native";
import Section, { SettingsSection } from "./ui/Section";

export default function DataSection() {
    const confirmClearData = () =>
        Alert.alert(
            "Clear Activity Data",
            "This will permanently delete all your activity history. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: () => {} },
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
