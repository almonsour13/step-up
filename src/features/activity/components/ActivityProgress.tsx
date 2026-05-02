import { ColView, RowView } from "@/shared/components/CustomView";
import StepGoalDrawer from "@/shared/components/drawer/StepGoalDrawer";
import Card from "@/shared/components/ui/Card";
import { DrawerHandle } from "@/shared/components/ui/Drawer";
import RingChart from "@/shared/components/ui/RingChart";
import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActivityProgress() {
    const settings = useSettingsStore((s) => s.settings);
    const activeActivity = useActiveActivityStore((s) => s.activeActivity);
    const stepGoalDrawerRef = useRef<DrawerHandle>(null);

    const current = activeActivity.steps;
    const target = settings.stepGoal ?? 0;
    const pct = (current / target) * 100;

    return (
        <>
            <Card className="aspect-square justify-center items-center">
                <View className="flex-1 aspect-square rounded-full justify-center items-center">
                    <View className="absolute inset-0 m-16 z-20 items-center justify-center rounded-full">
                        <ColView className="items-center">
                            <Text className="text-xs tracking-widest uppercase text-muted-foreground">
                                steps
                            </Text>
                            <Text className="text-6xl text-primary font-medium">
                                {current.toLocaleString()}
                            </Text>
                            <View className="flex-row items-center gap-2 mt-1">
                                <TouchableOpacity
                                    onPress={() =>
                                        stepGoalDrawerRef.current?.open()
                                    }
                                >
                                    <RowView className="px-3 py-1 items-center rounded-full bg-muted ">
                                        <Text className="text-xs text-muted-foreground">
                                            Goal {target.toLocaleString()}
                                        </Text>
                                        <Ionicons
                                            name="pencil"
                                            size={10}
                                            className="text-primary"
                                        />
                                    </RowView>
                                </TouchableOpacity>
                                <View className="px-3 py-1 rounded-full bg-muted">
                                    <Text className="text-xs font-medium text-primary">
                                        {pct.toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                        </ColView>
                    </View>
                    <RingChart
                        pct={pct}
                        radius={136}
                        strokeWidth={28}
                        trackWidth={24}
                        gapDeg={16}
                        startDeg={180}
                        trackColor="rgba(128,128,128,0.1)"
                    />
                </View>
            </Card>
            <StepGoalDrawer ref={stepGoalDrawerRef} />
        </>
    );
}
