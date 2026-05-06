import SettingsScreen from "@/features/settings/SettingsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    contentStyle: {
                        backgroundColor: "transparent",
                    },
                }}
            >
                <Stack.Screen
                    name="settings"
                    component={SettingsScreen}
                    options={{
                        animation: "slide_from_right",
                    }}
                />
            </Stack.Navigator>
        </SafeAreaView>
    );
}
