import "@/global.css";
import { useAppInit } from "@/shared/hooks/use-app-init";
import { useOnboarding } from "@/shared/hooks/use-onboarding";
import ThemeProvider from "@/shared/providers/ThemeProvider";
import {
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    useFonts,
} from "@expo-google-fonts/dm-sans";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const { ready } = useAppInit();
    const { isLoading } = useOnboarding();

    const [loaded] = useFonts({
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
        DMSans_700Bold,
    });
    const isAppReady = loaded && ready && !isLoading;
    useEffect(() => {
        if (isAppReady) {
            SplashScreen.hideAsync();
        }
    }, [isAppReady]);

    return (
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: "none",
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(main)" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="profile" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
