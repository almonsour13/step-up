import OnboardingProvider, {
    useOnboardingContext,
} from "@/features/onboarding/contexts/OnboardingContext";

import { useAppInit } from "@/shared/hooks/use-app-init";
import {
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    useFonts,
} from "@expo-google-fonts/dm-sans";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

import ActivityScreen from "@/features/activity/ActivityScreen";
import MainNavigator from "./MainNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import ProfilesNavigator from "./ProfileNavigator";
import SettingsNavigator from "./SettingsNavigator";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function RootNavigator() {
    return (
        <OnboardingProvider>
            <App />
        </OnboardingProvider>
    );
}

function App() {
    const { onboarded, loading } = useOnboardingContext();
    const { ready } = useAppInit();

    const [loaded] = useFonts({
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
        DMSans_700Bold,
    });

    const isReady = loaded && ready && !loading;

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    if (!isReady) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                    contentStyle: { backgroundColor: "transparent" },
                }}
            >
                {onboarded ? (
                    <>
                        <Stack.Screen name="main" component={MainNavigator} />
                        <Stack.Screen
                            name="settings"
                            component={SettingsNavigator}
                            options={{
                                animation: "slide_from_right",
                            }}
                        />
                        <Stack.Screen
                            name="activity"
                            component={ActivityScreen}
                            options={{
                                animation: "simple_push",
                            }}
                        />
                        <Stack.Screen
                            name="profile"
                            component={ProfilesNavigator}
                            options={{
                                animation: "slide_from_right",
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen
                        name="onboarding"
                        component={OnboardingNavigator}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
