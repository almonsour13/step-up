import { ColView, RowView } from "@/shared/components/CustomView";
import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/drawer/ActivitySessionsDrawer";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import Text from "@/shared/components/ui/Text";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { StatItem } from "@/shared/types/type";
import { calcCalories, calcDistanceKm } from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { memo, useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

function TodayActivity() {
    const profile = useProfileStore((s) => s.profile);
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);
    const date = new Date();

    const isLoading = useActivityStore((s) => s.isLoading);
    const activities = useActivityStore((s) => s.activities);

    const { sessions, steps, goal, duration, calories, distance } =
        useMemo(() => {
            const todayActivities = activities.filter(
                (a) =>
                    new Date(a.createdAt).toDateString() ===
                    date.toDateString(),
            );

            const sessions = todayActivities.length;
            const steps = todayActivities.reduce((a, b) => a + b.steps, 0);
            const duration = todayActivities.reduce(
                (sum, a) => sum + a.duration,
                0,
            );
            const goal = todayActivities.reduce((sum, a) => sum + a.goal, 0);

            const distance = todayActivities.reduce(
                (a, b) => a + calcDistanceKm(b.steps, profile?.height || 165),
                0,
            );

            const calories = todayActivities.reduce(
                (a, b) => a + calcCalories(b.steps, profile?.weight || 65),
                0,
            );

            return { sessions, steps, goal, duration, calories, distance };
        }, [activities, profile, date]);

    const stats: StatItem[] = [
        {
            label: "Distance",
            value: distance.toFixed(1).toLocaleString(),
            unit: "",
            icon: "location-outline",
        },
        {
            label: "Duration",
            value: duration.toFixed(1).toLocaleString(),
            unit: "",
            icon: "time-outline",
        },
        {
            label: "Calories",
            value: calories.toFixed(1).toLocaleString(),
            unit: "",
            icon: "flame-outline",
        },
    ];

    const pct = steps ? (steps / goal) * 100 : 0;
    const met = steps >= goal;
    const remainingSteps = Math.max(goal - steps, 0);

    const phrase = steps
        ? met
            ? `${steps.toLocaleString()} goal · exceeded by ${(steps - goal).toLocaleString()}`
            : `${remainingSteps.toLocaleString()} steps to reach ${goal.toLocaleString()} goal`
        : "no steps yet… time to get moving!";
    return (
        <>
            <ColView className="gap-2">
                <RowView className="px-4 justify-between items-end">
                    <Text className="text-lg font-medium text-foreground">
                        Today's activity
                    </Text>
                    {sessions > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                activitySessionsDrawerRef.current?.openWithActivities?.(
                                    date.toDateString(),
                                );
                            }}
                        >
                            <Text className="text-base text-primary">
                                {sessions} session
                                {sessions > 1 ? "s" : ""}
                            </Text>
                        </TouchableOpacity>
                    )}
                </RowView>
                <ColView className="px-4 gap-1">
                    {isLoading ? (
                        <Card className="h-48" />
                    ) : (
                        <Card className="w-full">
                            <ColView className="gap-4">
                                <RowView className="justify-between items-center">
                                    <ColView className="gap-1">
                                        <RowView className="items-baseline gap-1.5">
                                            <Text className="text-[40px] leading-none font-medium text-primary">
                                                {steps.toLocaleString()}
                                            </Text>
                                            <Text className="text-xs text-muted-foreground">
                                                steps today
                                            </Text>
                                        </RowView>
                                        <Text className="text-xs text-muted-foreground">
                                            {phrase}
                                        </Text>
                                    </ColView>

                                    <View className="relative items-center justify-center">
                                        <RingChart
                                            pct={Math.min(pct, 100)}
                                            radius={28}
                                            strokeWidth={8}
                                            strokeLinecap="round"
                                            trackColor="rgba(128,128,128,0.1)"
                                        />
                                        <Text className="absolute text-[11px] font-medium text-primary">
                                            {pct.toFixed(0)}
                                            <Text className="text-[9px]">
                                                %
                                            </Text>
                                        </Text>
                                    </View>
                                </RowView>

                                <View className="border-b border-border/40" />

                                {/* ── Stats ── */}
                                <RowView>
                                    {stats.map((stat, i) => (
                                        <ColView
                                            key={stat.label}
                                            className={
                                                i > 0
                                                    ? "flex-1 pl-4 border-l border-border/40 gap-1"
                                                    : "flex-1 gap-1"
                                            }
                                        >
                                            <RowView className="gap-1 items-center">
                                                <Ionicons
                                                    name={stat.icon}
                                                    size={11}
                                                    className="text-primary"
                                                />
                                                <Text className="text-[11px] text-muted-foreground">
                                                    {stat.label}
                                                </Text>
                                            </RowView>
                                            <Text className="text-[15px] font-medium text-foreground">
                                                {stat.value}
                                                {stat.unit && (
                                                    <Text className="text-[10px] font-normal text-muted-foreground">
                                                        {" "}
                                                        {stat.unit}
                                                    </Text>
                                                )}
                                            </Text>
                                        </ColView>
                                    ))}
                                </RowView>
                            </ColView>
                        </Card>
                    )}
                </ColView>
            </ColView>
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </>
    );
}

export default memo(TodayActivity);
