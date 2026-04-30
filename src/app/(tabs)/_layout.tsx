import { useActivityState } from "@/features/activity/hooks/use-activity-state";
import { initializeHomeStates } from "@/features/home/helper/initial-home-states";
import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainNavigation from "@/shared/components/layout/MainNavigation";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    useActivityState();
    initializeHomeStates();
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
