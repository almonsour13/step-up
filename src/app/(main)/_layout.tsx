import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainNavigation from "@/shared/components/layout/MainNavigation";
import { useActiveActivity } from "@/shared/hooks/use-active-activity";
import { useActivity } from "@/shared/hooks/use-activity";
import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
    useActivity();
    useActiveActivity();

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    gestureEnabled: true,
                    animation: "none", // or "none"
                }}
            />
            <ActiveActivityBanner />
            <MainNavigation />
        </>
    );
}
