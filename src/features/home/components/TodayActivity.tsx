import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { useTodayActivity } from "../hooks/use-today-activity";

export default function TodayActivity() {
    const { totalSteps, totalGoalSteps, stats, totalProgress } =
        useTodayActivity();
    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between">
                <Text className="text-base text-foreground">
                    Today Activity
                </Text>
            </RowView>
            <ColView className="px-4">
                <Card className="w-full">
                    <RowView className="justify-between">
                        <ColView className="flex-1">
                            <Text className="text-4xl text-foreground font-medium">
                                {totalSteps}{" "}
                                <Text className="text-sm text-muted-foreground">
                                    / {totalGoalSteps} steps
                                </Text>
                            </Text>

                            <RowView className="gap-4">
                                {stats.map((stat) => {
                                    return (
                                        <ColView
                                            key={stat.label}
                                            className="justify-center items-start gap-0.5"
                                        >
                                            <RowView className="items-end gap-1">
                                                <Text className="text-xl text-foreground font-semibold">
                                                    {stat.value}
                                                </Text>
                                                {stat.unit && (
                                                    <Text className="text-xs text-muted-foreground pb-1">
                                                        {stat.unit}
                                                    </Text>
                                                )}
                                            </RowView>
                                            <RowView className="gap-1 items-center">
                                                <Ionicons
                                                    name={stat.icon}
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                <Text className="text-xs font-normal text-muted-foreground">
                                                    {stat.label}
                                                </Text>
                                            </RowView>
                                        </ColView>
                                    );
                                })}
                            </RowView>
                        </ColView>
                        <View className="hidden h-24 rounded-full aspect-square border-12 border-primary">
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-xl font-medium">
                                    {totalProgress.toFixed(0)}
                                    <Text className="text-sm">%</Text>
                                </Text>
                            </View>
                        </View>
                        <View className="bg-card">
                            <RingChart
                                pct={totalProgress}
                                radius={32}
                                strokeWidth={10}
                                trackColor="transparent"
                                startDeg={180}
                            />
                            <View className="absolute top-0 left-0 w-full h-full flex-1 justify-center items-center">
                                <Text className="text-xl font-medium">
                                    {totalProgress.toFixed(0)}
                                    <Text className="text-sm">%</Text>
                                </Text>
                            </View>
                        </View>
                    </RowView>
                </Card>
            </ColView>
        </ColView>
    );
}
