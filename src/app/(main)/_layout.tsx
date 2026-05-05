import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainNavigation from "@/shared/components/layout/MainNavigation";
import { useActiveActivity } from "@/shared/hooks/use-active-activity";
import { useActivity } from "@/shared/hooks/use-activity";
import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainLayout() {
    useActivity();
    useActiveActivity();

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        animation: "none",
                        sceneStyle: {
                            backgroundColor: "transparent",
                        },
                    }}
                    tabBar={(props) => null}
                >
                    <Tabs.Screen name="index" />
                    <Tabs.Screen name="history" />
                    <Tabs.Screen name="activity" />
                </Tabs>
                <ActiveActivityBanner />
                <MainNavigation />
            </SafeAreaView>
        </>
    );
}
