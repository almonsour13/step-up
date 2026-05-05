import OnBoardingProvider from "@/features/onboarding/contexts/OnBoardingContext";
import { Stack } from "expo-router";

export default function OnboardingStepsLayout() {
    return (
        <OnBoardingProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: "slide_from_right",
                }}
            />
        </OnBoardingProvider>
    );
}
