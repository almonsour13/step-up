import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
import { Text, View } from "react-native";

export default function RecentActivity() {
    const activities = [
        {
            startTime: "2026-04-29T20:00:00",
            endTime: "2026-04-29T22:30:00",
            steps: 5400,
            goal: 7000,
            distance: 4.8,
            calories: 285,
        },
        {
            startTime: "2026-04-28T18:10:00",
            endTime: "2026-04-28T19:40:00",
            steps: 6200,
            goal: 7000,
            distance: 5.3,
            calories: 310,
        },
        {
            startTime: "2026-04-27T06:30:00",
            endTime: "2026-04-27T07:45:00",
            steps: 4100,
            goal: 7000,
            distance: 3.6,
            calories: 220,
        },
        {
            startTime: "2026-04-26T17:00:00",
            endTime: "2026-04-26T18:50:00",
            steps: 7800,
            goal: 7000,
            distance: 6.9,
            calories: 420,
        },
        {
            startTime: "2026-04-25T19:15:00",
            endTime: "2026-04-25T20:10:00",
            steps: 3200,
            goal: 7000,
            distance: 2.9,
            calories: 180,
        },
    ];

    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between">
                <Text className="text-base text-foreground">
                    Recent Activity
                </Text>
                <Text className="text-base text-muted-foreground">See All</Text>
            </RowView>
            <ColView className="px-4 gap-2 ">
                {activities.map((activity, i) => {
                    const start = new Date(activity.startTime);
                    const end = new Date(activity.endTime);

                    const durationMin =
                        (end.getTime() - start.getTime()) / 60000;
                    const hours = Math.floor(durationMin / 60);
                    const mins = Math.floor(durationMin % 60);
                    const duration = `${hours}h ${mins}m`;

                    const progress = (activity.steps / activity.goal) * 100;
                    const stats = [
                        {
                            label: "Duration",
                            value: duration,
                            icon: "time" as const,
                        },
                        {
                            label: "Distance",
                            value: activity.distance,
                            unit: "km",
                            icon: "location" as const,
                        },
                        {
                            label: "Calories",
                            value: activity.calories,
                            unit: "kcal",
                            icon: "flame" as const,
                        },
                    ];
                    return (
                        <Card key={i}>
                            <RowView className="gap-4">
                                {/* tempaory icon holder */}
                                <View className="bg-card">
                                    <RingChart
                                        pct={progress}
                                        radius={26}
                                        strokeWidth={8}
                                        trackColor="transparent"
                                    />
                                    <View className="absolute top-0 left-0 w-full h-full flex-1 justify-center items-center">
                                        <Text className="text-sm font-medium text-foreground">
                                            {progress.toFixed(0)}
                                            <Text className="text-xs">%</Text>
                                        </Text>
                                    </View>
                                </View>
                                <ColView className="flex-1 gap-1">
                                    <RowView className="justify-between">
                                        <Text className="text-muted-foreground text-xs">
                                            {format(start, "MMMM dd")} •{" "}
                                            {format(start, "p")} -{" "}
                                            {format(end, "p")}
                                        </Text>
                                        <MaterialIcons
                                            name="arrow-forward-ios"
                                            size={12}
                                            className="text-muted-foreground"
                                        />
                                    </RowView>
                                    <RowView className="items-center">
                                        <Text className="text-2xl text-foreground font-medium">
                                            {activity.steps.toLocaleString()}{" "}
                                            <Text className="text-xs text-muted-foreground">
                                                /{" "}
                                                {activity.goal.toLocaleString()}{" "}
                                                steps
                                            </Text>
                                        </Text>
                                    </RowView>

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
                            </RowView>
                        </Card>
                    );
                })}
            </ColView>
        </ColView>
    );
}
