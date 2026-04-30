import { useActivityState } from "@/features/activity/hooks/use-activity-state";
import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainNavigation from "@/shared/components/layout/MainNavigation";
import { useActivity } from "@/shared/hooks/use-activity";
import { useUserStore } from "@/shared/stores/use-user.store";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    useActivityState();
    useActivity();
    const { profile, setProfile } = useUserStore();

    useEffect(() => {
        if (!profile) {
            setProfile({
                name: "Monsour",
                age: 23,
                height: 165,
                weight: 65,
                gender: "male",
            });
        }
    }, [profile]);

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                        animation: "fade",
                    }}
                />
                <ActiveActivityBanner />
                <MainNavigation />
            </SafeAreaView>
        </>
    );
}
