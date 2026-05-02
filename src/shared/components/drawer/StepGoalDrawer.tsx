import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { STEP_GOAL_OPTIONS } from "@/shared/constants/constant";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname } from "expo-router";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    children?: React.ReactNode;
}

const StepGoalDrawer = forwardRef<DrawerHandle, Props>((_, ref) => {
    const drawerRef = useRef<DrawerHandle>(null);
    const setStepGoal = useSettingsStore((s) => s.setStepGoal);
    const settings = useSettingsStore((s) => s.settings);
    const pathname = usePathname();
    useImperativeHandle(ref, () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
    }));

    useEffect(() => {
        if (pathname !== "/settings") return;
        if (settings.stepGoal !== 0) return;
        const t = setTimeout(() => drawerRef.current?.open(), 0);
        return () => clearTimeout(t);
    }, [settings.stepGoal]);

    return (
        <Drawer ref={drawerRef}>
            <View className="p-4 px-0">
                <ColView className="gap-0">
                    {STEP_GOAL_OPTIONS.map((steps) => {
                        const isSelected = settings.stepGoal === steps;
                        return (
                            <TouchableOpacity
                                key={steps}
                                onPress={() => {
                                    setStepGoal(steps);
                                    drawerRef.current?.close();
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
                                        {steps.toLocaleString()}
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
            </View>
        </Drawer>
    );
});

export default StepGoalDrawer;
