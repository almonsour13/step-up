import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/Drawer";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";

interface Props {
    children?: React.ReactNode;
}

const GOAL_STEPS_LIST = [2000, 3000, 5000, 7500, 10000, 12500, 15000, 20000];

export default function GoalDrawer({ children }: Props) {
    const drawerRef = useRef<DrawerHandle>(null);
    const status = useActivityStore((s) => s.status);
    const goalSteps = useActivityStore((s) => s.goalSteps);
    const setGoalSteps = useActivityStore((s) => s.setGoalSteps);

    useEffect(() => {
        if (goalSteps !== 0) return;
        const t = setTimeout(() => drawerRef.current?.open(), 0);
        return () => clearTimeout(t);
    }, [goalSteps]);

    return (
        <>
            <Pressable
                disabled={status === "active"}
                onPress={() => {
                    drawerRef.current?.open();
                    console.log("drawer opened");
                }}
            >
                {children}
            </Pressable>
            <Drawer ref={drawerRef}>
                <View className="p-4 px-0">
                    <ColView className="gap-0">
                        {GOAL_STEPS_LIST.map((steps) => {
                            const isSelected = goalSteps === steps;
                            return (
                                <TouchableOpacity
                                    key={steps}
                                    onPress={() => {
                                        setGoalSteps(steps);
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
        </>
    );
}
