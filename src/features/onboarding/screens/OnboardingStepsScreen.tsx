import { ColView, RowView } from "@/shared/components/CustomView";
import Text from "@/shared/components/ui/Text";
import { onboardingService } from "@/shared/services/storage/oboarding.service";
import { profileService } from "@/shared/services/storage/profile.services";
import { settingsService } from "@/shared/services/storage/settings.service";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { cn } from "@/shared/utils/cn";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import FinishSteps from "../components/steps/FinishSteps";
import PermissionSteps from "../components/steps/PermissionSteps";
import PreferencesSteps from "../components/steps/PreferencesSteps";
import ProfileSteps from "../components/steps/ProfileSteps";
import { useOnboardingContext } from "../contexts/OnboardingContext";

const { width } = Dimensions.get("window");
const STEPS = ["Profile", "Preferences", "Permission", "Finish"];

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

export default function OnboardingStepsScreen() {
    const { setOnboarded } = useOnboardingContext();
    const navigation = useNavigation();
    const flatListRef = useRef<FlatList>(null);
    const profile = useProfileStore((s) => s.profile);
    const setProfile = useProfileStore((s) => s.setProfile);
    const settings = useSettingsStore((s) => s.settings);

    const [index, setIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const isFirst = index === 0;
    const isLast = index === STEPS.length - 1;
    const canNext = canProceed(index, profile, settings);

    const nextStep = async () => {
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
                await settingsService.update(settings);
                await onboardingService.completeOnboarding();
                setOnboarded(true);
                navigation.navigate("onboarding" as never);
            } catch (e) {
                console.error("[OnBoarding] Failed to finish:", e);
            } finally {
                setSaving(false);
            }
            return;
        }
        const next = index + 1;
        setIndex(next);

        flatListRef.current?.scrollToIndex({
            index: next,
            animated: true,
        });
    };

    const prevStep = () => {
        if (index > 0) {
            const prev = index - 1;
            setIndex(prev);

            flatListRef.current?.scrollToIndex({
                index: prev,
                animated: true,
            });
        }
    };
    return (
        <ColView className="flex-1 gap-12">
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
            <View className="flex-1">
                <FlatList
                    ref={flatListRef}
                    data={STEPS}
                    keyExtractor={(item) => item}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const i = Math.round(
                            e.nativeEvent.contentOffset.x / width,
                        );
                        setIndex(i);
                    }}
                    renderItem={({ item }) => {
                        switch (item) {
                            case "Profile":
                                return <ProfileSteps />;
                            case "Preferences":
                                return <PreferencesSteps />;
                            case "Permission":
                                return <PermissionSteps />;
                            case "Finish":
                                return <FinishSteps />;
                            default:
                                return null;
                        }
                    }}
                />
            </View>

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
    );
}
