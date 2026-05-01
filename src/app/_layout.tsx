import "@/global.css";
import clsx from "clsx";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <View
            className={clsx(
                "bg-accent-foreground/5 flex-1",
                isDark ? "dark" : "",
            )}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                        animation: "none",
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="settings" />
                </Stack>
                <StatusBar style="auto" />
            </SafeAreaView>
        </View>
    );
}
