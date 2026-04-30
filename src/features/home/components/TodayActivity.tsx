import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { useTodayActivity } from "../hooks/use-today-activity";

export default function TodayActivity() {
    const {
        totalSteps,
        totalGoalSteps,
        stats,
        totalProgress,
        todayActivities,
    } = useTodayActivity();

    const met = totalSteps >= totalGoalSteps;
    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between items-center">
                <Text className="text-base font-medium text-foreground">
                    Today's activity
                </Text>
                {todayActivities.length > 0 && (
                    <Text className="text-sm text-primary">
                        {todayActivities.length} session
                        {todayActivities.length > 1 ? "s" : ""}
                    </Text>
                )}
            </RowView>

            <ColView className="px-4 gap-2">
                {/* Steps card */}
                <Card className="w-full">
                    <RowView className="justify-between items-center">
                        <ColView className="gap-2">
                            <RowView className="items-baseline gap-1.5">
                                <Text className="text-4xl leading-none font-medium text-foreground">
                                    {totalSteps.toLocaleString()}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    / {totalGoalSteps.toLocaleString()} steps
                                </Text>
                            </RowView>

                            {/* Progress bar */}
                            <View className="h-1 w-48 rounded-full bg-muted/40 overflow-hidden">
                                <View
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                        width: `${Math.min(totalProgress, 100)}%`,
                                    }}
                                />
                            </View>
                        </ColView>

                        <View className="relative items-center justify-center">
                            <RingChart
                                pct={Math.min(totalProgress, 100)}
                                radius={28}
                                strokeWidth={6}
                                strokeLinecap="round"
                                trackColor="rgba(128,128,128,0.1)"
                                color={met ? "#639922" : "white"}
                            />
                            <Text className="absolute text-[11px] font-medium text-primary">
                                {totalProgress.toFixed(0)}
                                <Text className="text-[9px]">%</Text>
                            </Text>
                        </View>
                    </RowView>
                </Card>

                {/* Stat cards */}
                <RowView className="gap-2">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="flex-1 gap-1.5">
                            <Ionicons
                                name={stat.icon}
                                size={14}
                                className="text-primary"
                            />
                            <ColView className="gap-0.5">
                                <Text className="text-base leading-none font-medium text-foreground">
                                    {stat.value}
                                    {stat.unit && (
                                        <Text className="text-[10px] font-normal text-muted-foreground">
                                            {" "}
                                            {stat.unit}
                                        </Text>
                                    )}
                                </Text>
                                <Text className="text-[10px] text-muted-foreground">
                                    {stat.label}
                                </Text>
                            </ColView>
                        </Card>
                    ))}
                </RowView>
            </ColView>
        </ColView>
    );
}
