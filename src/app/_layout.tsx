import "@/global.css";
import { useAppInit } from "@/shared/hooks/use-app-init";
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
import { Text } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// ← Patch here, before any render
if (!Text.defaultProps) Text.defaultProps = {};
Text.defaultProps.style = { fontFamily: "DMSans_400Regular" };

export default function RootLayout() {
    const { ready } = useAppInit();

    const [loaded, error] = useFonts({
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
        DMSans_700Bold,
    });

    useEffect(() => {
        if (loaded || error) SplashScreen.hideAsync();
    }, [loaded, error]);

    if (!loaded && !error) return null;

    return (
        <ThemeProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                        animation: "none",
                    }}
                />
                <StatusBar style="auto" />
            </SafeAreaView>
        </ThemeProvider>
    );
}
