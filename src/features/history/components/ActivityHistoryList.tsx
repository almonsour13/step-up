import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import {
    calcCalories,
    calcDistanceKm,
    formatDuration,
} from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, isToday, isYesterday } from "date-fns";
import { Text, View } from "react-native";
import { useActivityHistory } from "../hooks/use-activity-history";

const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};
function formatActivityDate(date: Date) {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
}

export default function ActivityHistoryList() {
    const activityHistory = useActivityHistory();
    return (
        <ColView className="px-4">
            {activityHistory.map((activity, i) => {
                const start = new Date(activity.startTime);
                const end = new Date(activity.endTime);

                const progress = (activity.steps / activity.goalStep) * 100;
                const met = activity.steps >= activity.goalStep;
                const stats = [
                    {
                        label: "Duration",
                        value: formatDuration(activity.duration),
                        icon: "time" as const,
                    },
                    {
                        label: "Distance",
                        value: calcDistanceKm(
                            activity.steps,
                            TEMP_USER.heightCm,
                        ).toFixed(2),
                        unit: "km",
                        icon: "location" as const,
                    },
                    {
                        label: "Calories",
                        value: calcCalories(
                            activity.steps,
                            TEMP_USER.weightKg,
                        ).toFixed(1),
                        unit: "kcal",
                        icon: "flame" as const,
                    },
                ];
                return (
                    <Card key={activity.id}>
                        <ColView>
                            <RowView className="justify-between items-center">
                                <Text className="text-[11px] text-muted-foreground">
                                    {formatActivityDate(start)} ·{" "}
                                    {format(start, "p")} – {format(end, "p")}
                                </Text>
                                <View
                                    className={`px-2 py-0.5 rounded-full ${met ? "bg-primary" : "bg-muted"}`}
                                >
                                    <Text
                                        className={`text-[10px] font-medium ${met ? "text-white" : "text-muted-foreground"}`}
                                    >
                                        {met
                                            ? "✓ Goal met"
                                            : `${progress.toFixed(0)}%`}
                                    </Text>
                                </View>
                            </RowView>
                            <RowView className="items-center">
                                <Text className="text-2xl text-foreground font-medium">
                                    {activity.steps.toLocaleString()}{" "}
                                    <Text className="text-xs text-muted-foreground">
                                        / {activity.goalStep.toLocaleString()}{" "}
                                        steps
                                    </Text>
                                </Text>
                            </RowView>
                            <View className="h-1 rounded-full bg-muted overflow-hidden">
                                <View
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                        width: `${Math.min(100, progress)}%`,
                                    }}
                                />
                            </View>
                            <RowView className="gap-4">
                                {stats.map((stat) => {
                                    return (
                                        <ColView
                                            key={stat.label}
                                            className="justify-start items-center gap-0"
                                        >
                                            <RowView className="items-center gap-1">
                                                <Ionicons
                                                    name={stat.icon}
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                {/* <View className="w-1.5 h-1.5 rounded-full bg-primary" /> */}
                                                <Text className="text-sm text-foreground font-semibold">
                                                    {stat.value}{" "}
                                                    {stat.unit && (
                                                        <Text className="text-xs font-normal text-muted-foreground">
                                                            {stat.unit}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </RowView>
                                        </ColView>
                                    );
                                })}
                            </RowView>
                        </ColView>
                    </Card>
                );
            })}
        </ColView>
    );
}
