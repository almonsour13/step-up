import { ColView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import { Text, View } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";

export default function ActivityProgress() {
    const steps = useActivityStore((s) => s.steps);

    const goal = 5000;
    const current = steps;
    const pct = (current / goal) * 100;
    return (
        <Card className="aspect-square justify-center items-center">
            <View className="flex-1 aspect-square rounded-full justify-center items-center">
                <View className="absolute inset-0 m-16 items-center justify-center rounded-full">
                    <ColView className="items-center">
                        <Text className="text-xs tracking-widest uppercase text-muted-foreground">
                            steps
                        </Text>
                        <Text className="text-6xl text-primary font-medium">
                            {current.toLocaleString()}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1">
                            <View className="px-3 py-1 rounded-full bg-muted">
                                <Text className="text-xs text-muted-foreground">
                                    Goal {goal.toLocaleString()}
                                </Text>
                            </View>
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
                    trackColor="transparent"
                    radius={136}
                    strokeWidth={30}
                    gapDeg={16}
                    startDeg={180}
                />
            </View>
        </Card>
    );
}
