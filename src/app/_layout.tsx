import "@/global.css";
import { useAppInit } from "@/shared/hooks/use-app-init";
import ThemeProvider from "@/shared/providers/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const { ready } = useAppInit();

    // if (!ready) {
    //     return (
    //         <View className="flex-1 items-center justify-center bg-background">
    //             <ActivityIndicator />
    //         </View>
    //     );
    // }
    return (
        <ThemeProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                        animation: "none",
                    }}
                >
                    <Stack.Screen name="(main)" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="profile" />
                </Stack>
                <StatusBar style="auto" />
            </SafeAreaView>
        </ThemeProvider>
    );
}
