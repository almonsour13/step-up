import ActivityCard from "@/features/home/components/ui/ActivityCard";
import { useActivitySessions } from "@/features/home/hooks/use-activity-sessions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { forwardRef, memo, useImperativeHandle, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useUserStore } from "../../stores/use-user.store";
import { getActivityStats } from "../../utils/activity-stats.utils";
import { formatActivityDate } from "../../utils/utils";
import { ColView, RowView } from "../CustomView";
import Card from "../ui/Card";
import Drawer, { DrawerHandle } from "../ui/Drawer";
import RingChart from "../ui/RingChart";

type Props = {};

export type ActivitySessionsDrawerHandle = DrawerHandle & {
    openWithActivities: (day: string) => void;
};

const ActivitySessionsDrawer = forwardRef<DrawerHandle, Props>((_, ref) => {
    const profile = useUserStore((s) => s.profile);
    const drawerRef = useRef<DrawerHandle>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const activities = useActivitySessions(selectedDay);

    useImperativeHandle(ref, () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
        openWithActivities: (day: string) => {
            setSelectedDay(day);
            drawerRef.current?.open();
        },
    }));

    const dayDate = activities[0]
        ? new Date(activities[0].startTime)
        : new Date();

    const stats = getActivityStats({
        activities,
        profile,
        fields: ["duration", "distance", "calories"],
    });
    const totalSteps = activities.reduce((acc, a) => acc + a.steps, 0);
    const totalGoalSteps = activities.reduce(
        (acc, activity) => acc + activity.goalStep,
        0,
    );
    const totalPct = Math.min((totalSteps / totalGoalSteps) * 100, 100);
    const remainingSteps = Math.max(0, totalGoalSteps - totalSteps);
    const met = totalSteps >= totalGoalSteps;
    const metCount = activities.filter((a) => a.steps >= a.goalStep).length;
    const allMet = metCount === activities.length && activities.length > 0;

    const distanceKm = stats.find((s) => s.label === "Distance")?.value;
    const caloriesBurned = stats.find((s) => s.label === "Calories")?.value;

    if (activities.length === 0) {
        return (
            <Drawer ref={drawerRef}>
                <ColView className="items-center justify-center gap-3 px-4 py-16">
                    <Ionicons
                        name="footsteps-outline"
                        size={32}
                        className="text-muted-foreground"
                    />
                    <ColView className="items-center gap-1">
                        <Text className="text-sm font-medium text-foreground">
                            No sessions
                        </Text>
                        <Text className="text-xs text-muted-foreground text-center">
                            Activity sessions for this day will appear here.
                        </Text>
                    </ColView>
                </ColView>
            </Drawer>
        );
    }

    return (
        <>
            <Drawer ref={drawerRef}>
                <ColView className="gap-4 p-4">
                    <RowView className="justify-between">
                        <ColView className="gap-0.5 flex-1">
                            <Text className="text-base font-medium text-foreground">
                                {formatActivityDate(dayDate)}
                                {", "}
                                {format(dayDate, "MMM d")}
                            </Text>
                            <Text className="text-[11px] text-muted-foreground">
                                {activities.length} session
                                {activities.length !== 1 ? "s" : ""} ·{" "}
                                {metCount} goal
                                {metCount !== 1 ? "s" : ""} met
                            </Text>
                        </ColView>
                        <ColView>
                            <View className="px-3 py-1 bg-muted rounded-full">
                                <Text className="text-xs">
                                    {allMet
                                        ? "✓ All goals met"
                                        : `${metCount}/${activities.length} goals`}
                                </Text>
                            </View>
                        </ColView>
                    </RowView>

                    <RowView className="justify-between">
                        <ColView className="gap-0">
                            <RowView className="items-baseline gap-1.5">
                                <Text className="text-[40px] leading-none font-medium text-primary">
                                    {totalSteps.toLocaleString()}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    steps today
                                </Text>
                            </RowView>
                            <Text className="text-[11px] text-muted-foreground">
                                {met
                                    ? `${totalGoalSteps.toLocaleString()} goal · exceeded by ${(totalSteps - totalGoalSteps).toLocaleString()}`
                                    : `${remainingSteps.toLocaleString()} steps to reach ${totalGoalSteps.toLocaleString()} goal`}
                            </Text>
                        </ColView>
                        <View className="relative items-center justify-center">
                            <RingChart
                                pct={Math.min(totalPct, 100)}
                                radius={28}
                                strokeWidth={8}
                                strokeLinecap="round"
                                trackColor="rgba(128,128,128,0.1)"
                            />
                            <Text className="absolute text-[11px] font-medium text-primary">
                                {totalPct.toFixed(0)}
                                <Text className="text-base">%</Text>
                            </Text>
                        </View>
                    </RowView>

                    <View className="border-b border-border/40" />

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

                    <View className="border-b border-border/40" />

                    <Card className="items-center bg-muted border-0">
                        <Text className="text-xs text-muted-foreground flex-1">
                            You walked {distanceKm} km and burned{" "}
                            {caloriesBurned} kcal in this sessions.
                        </Text>
                    </Card>

                    <ColView className="gap-2">
                        <Text className="text-sm">Sessions</Text>
                        <ColView className="gap-1">
                            {activities.map((activity) => {
                                return (
                                    <ActivityCard
                                        key={activity.id}
                                        activity={activity}
                                        showDay={false}
                                        className="border border-border/50"
                                    />
                                );
                            })}
                        </ColView>
                    </ColView>
                </ColView>
            </Drawer>
        </>
    );
});

export default memo(ActivitySessionsDrawer);
