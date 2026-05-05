import { ColView, RowView } from "@/shared/components/CustomView";
import Text from "@/shared/components/ui/Text";
import { onboardingService } from "@/shared/services/storage/oboarding.service";
import { profileService } from "@/shared/services/storage/profile.services";
import { settingsService } from "@/shared/services/storage/settings.service";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";

type OnboardingContextType = {
    step: string;
    index: number;
    total: number;
    nextStep: () => void;
    prevStep: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboardingContext = () => {
    const ctx = useContext(OnboardingContext);
    if (!ctx)
        throw new Error(
            "useOnboardingContext must be used within OnBoardingProvider",
        );
    return ctx;
};

const PREFIX = "/onboarding/steps";
const STEPS = ["/", "/preferences", "/permission", "/finish"];

const canProceed = (
    index: number,
    profile: ReturnType<typeof useProfileStore.getState>["profile"],
    settings: ReturnType<typeof useSettingsStore.getState>["settings"],
): boolean => {
    switch (index) {
        case 0: // profile
            return (
                !!profile?.name?.trim() &&
                profile.age > 0 && // ✅ explicit check
                !!profile?.gender &&
                profile.weight > 0 && // ✅ explicit check
                profile.height > 0
            );
        case 1: // preferences — has defaults so always valid
            return !!settings?.stepGoal && !!settings?.units;
        case 2: // permission — optional, always allow next
            return true;
        case 3: // finish
            return true;
        default:
            return true;
    }
};

export default function OnBoardingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const profile = useProfileStore((s) => s.profile);
    const setProfile = useProfileStore((s) => s.setProfile);
    const settings = useSettingsStore((s) => s.settings);
    const [index, setIndex] = useState(0);
    const [saving, setSaving] = useState(false);

    const isFirst = index === 0;
    const isLast = index === STEPS.length - 1;
    const canNext = canProceed(index, profile, settings);

    const nextStep = async () => {
        if (!canNext || saving) return;

        if (isLast) {
            setSaving(true);
            try {
                if (profile) {
                    const saved = await profileService.save({
                        name: profile.name,
                        age: profile.age,
                        height: profile.height,
                        weight: profile.weight,
                        gender: profile.gender!,
                    });
                    setProfile(saved);
                }
                router.replace("/(main)");
                await settingsService.update(settings);
                await onboardingService.completeOnboarding();
            } catch (e) {
                console.error("[OnBoarding] Failed to finish:", e);
            } finally {
                setSaving(false);
            }
            return;
        }

        const next = index + 1;
        setIndex(next);
        router.push(`${PREFIX}${STEPS[next]}`);
    };

    const prevStep = () => {
        if (isFirst) return;
        setIndex((i) => i - 1);
        router.back();
    };

    return (
        <OnboardingContext.Provider
            value={{
                step: STEPS[index],
                index,
                total: STEPS.length,
                nextStep,
                prevStep,
            }}
        >
            <ColView className="flex-1 gap-12">
                {/* Progress bar */}
                <RowView className="pt-12 px-4 gap-1.5">
                    {STEPS.map((s, i) => (
                        <View
                            key={s}
                            className={cn(
                                "flex-1 h-1 rounded-full",
                                i <= index ? "bg-primary" : "bg-muted",
                            )}
                        />
                    ))}
                </RowView>

                {/* Screen content */}
                <ColView className="flex-1">{children}</ColView>

                {/* Navigation */}
                <RowView className="px-4 pb-12 gap-3">
                    {!isFirst ? (
                        <TouchableOpacity
                            onPress={prevStep}
                            className="h-16 flex-1 rounded-full justify-center items-center bg-muted"
                        >
                            <Text className="text-foreground font-medium">
                                Back
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-1" />
                    )}
                    <TouchableOpacity
                        onPress={nextStep}
                        disabled={!canNext || saving}
                        className={cn(
                            "h-16 flex-1 rounded-full justify-center items-center bg-primary",
                            (!canNext || saving) && "opacity-50",
                        )}
                    >
                        <Text className="text-white font-medium">
                            {saving ? "Saving..." : isLast ? "Finish" : "Next"}
                        </Text>
                    </TouchableOpacity>
                </RowView>
            </ColView>
        </OnboardingContext.Provider>
    );
}
