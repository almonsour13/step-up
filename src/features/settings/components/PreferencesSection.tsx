import { ColView, RowView } from "@/shared/components/CustomView";
import StepGoalDrawer from "@/shared/components/drawer/StepGoalDrawer";
import UnitsDrawer from "@/shared/components/drawer/UnitsDrawer";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { THEME_OPTIONS } from "@/shared/constants/constant";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { Theme } from "@/shared/types/type";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { TouchableOpacity } from "react-native";
import Section, { SettingsSection } from "./ui/Section";

export default function PreferencesSection() {
    const settings = useSettingsStore((s) => s.settings);
    const setTheme = useSettingsStore((s) => s.setTheme);
    const setUnits = useSettingsStore((s) => s.setUnits);

    const themeDrawerRef = useRef<DrawerHandle>(null);
    const unitsDrawerRef = useRef<DrawerHandle>(null);
    const stepGoalDrawerRef = useRef<DrawerHandle>(null);

    const handleStepGoal = () => {
        stepGoalDrawerRef.current?.open();
    };
    const handleUnits = () => {
        unitsDrawerRef.current?.open();
    };
    const handleTheme = () => {
        themeDrawerRef.current?.open();
    };
    const preferences: SettingsSection = {
        title: "Preferences",
        items: [
            {
                label: "Theme",
                description: "Follow system or choose manually",
                icon: "color-palette",
                value: capitalize(settings.theme),
                onPress: handleTheme,
                type: "cycle",
            },
            {
                label: "Units",
                description: "Distance measurement",
                icon: "swap-horizontal",
                value: settings.units,
                onPress: handleUnits,
                type: "cycle",
            },
            {
                label: "Step Goal",
                description: "Daily step target",
                icon: "flag-outline",
                value: settings.stepGoal,
                onPress: handleStepGoal,
                type: "cycle",
            },
        ],
    };
    return (
        <>
            <Section section={preferences} />
            <Drawer ref={themeDrawerRef}>
                <ColView>
                    {THEME_OPTIONS.map((t) => {
                        const lowerT = t.toLowerCase() as Theme;
                        const isSelected = settings.theme === lowerT;
                        return (
                            <TouchableOpacity
                                key={t}
                                onPress={() => {
                                    setTheme(lowerT);
                                    themeDrawerRef.current?.close();
                                }}
                                className={cn(
                                    "p-4 px-8 h-16 justify-center",
                                    isSelected && "bg-muted",
                                )}
                            >
                                <RowView className="justify-between">
                                    <Text
                                        className={cn(
                                            "text-lg",
                                            isSelected && "text-primary",
                                        )}
                                    >
                                        {t.toLocaleString()}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            className="text-primary"
                                        />
                                    )}
                                </RowView>
                            </TouchableOpacity>
                        );
                    })}
                </ColView>
            </Drawer>
            <UnitsDrawer ref={unitsDrawerRef} />
            <StepGoalDrawer ref={stepGoalDrawerRef} />
        </>
    );
}
