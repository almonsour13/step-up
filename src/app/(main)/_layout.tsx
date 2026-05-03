import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainNavigation from "@/shared/components/layout/MainNavigation";
import { useActiveActivity } from "@/shared/hooks/use-active-activity";
import { useActivity } from "@/shared/hooks/use-activity";
import { requestAllPermissions } from "@/shared/hooks/use-permission";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
    useActivity();
    useActiveActivity();

    useEffect(() => {
        requestAllPermissions();
    }, []);

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    // Tabs handles slide direction automatically
                    // based on tab index order
                    animation: "none",
                    sceneStyle: {
                        backgroundColor: "transparent",
                    },
                }}
                tabBar={() => null} // hide default tab bar — you use MainNavigation
            >
                <Tabs.Screen name="home" />
                <Tabs.Screen name="history" />
                <Tabs.Screen name="activity" />
            </Tabs>
            <ActiveActivityBanner />
            <MainNavigation />
        </>
    );
}
