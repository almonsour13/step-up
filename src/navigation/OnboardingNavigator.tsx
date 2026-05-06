import OnboardingScreen from "@/features/onboarding/screens/OnboardingScreen";
import OnboardingStepsScreen from "@/features/onboarding/screens/OnboardingStepsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
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
                <Stack.Screen name="onboarding" component={OnboardingScreen} />
                <Stack.Screen
                    name="onboardingSteps"
                    component={OnboardingStepsScreen}
                />
            </Stack.Navigator>
        </SafeAreaView>
    );
}
