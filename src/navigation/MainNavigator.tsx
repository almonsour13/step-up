import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import HistoryScreen from "@/features/history/HistoryScreen";
import HomeScreen from "@/features/home/HomeScreen";
import ActiveActivityBanner from "@/shared/components/ActiveActivityBanner";
import MainTabBar from "@/shared/components/layout/MainTabBar";
import { useActiveActivity } from "@/shared/hooks/use-active-activity";
import { useActivity } from "@/shared/hooks/use-activity";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    useActiveActivity();
    useActivity();
    const rootNavigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "shift",
                    sceneStyle: {
                        backgroundColor: "transparent",
                    },
                    lazy: false,
                    transitionSpec: {
                        animation: "timing",
                        config: {
                            duration: 300, // 👈 adjust delay/speed here
                        },
                    },
                }}
                tabBar={(props) => (
                    <>
                        <ActiveActivityBanner />
                        <MainTabBar {...props} />
                    </>
                )}
            >
                <Tab.Screen name="home" component={HomeScreen} />
                <Tab.Screen name="history" component={HistoryScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
