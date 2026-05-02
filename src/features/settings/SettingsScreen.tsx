import { ColView } from "@/shared/components/CustomView";
import { ScrollView, Text } from "react-native";
import DataSection from "./components/DataSection";
import SettingsHeader from "./components/layout/SettingsHeader";
import PreferencesSection from "./components/PreferencesSection";
import ProfileSection from "./components/ProfileCard";

export default function SettingsScreen() {
    return (
        <ScrollView className="" contentContainerStyle={{ flexGrow: 1 }}>
            <ColView className="flex-1 ">
                <SettingsHeader />
                <ProfileSection />
                <PreferencesSection />
                <DataSection />
                <ColView className="flex-1 justify-end items-center my-8">
                    <Text className="text-center text-xs text-muted-foreground">
                        Version 1.0.0
                    </Text>
                </ColView>
            </ColView>
        </ScrollView>
    );
}
