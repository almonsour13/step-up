import { ColView, RowView } from "@/shared/components/CustomView";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { Activity } from "@/shared/types/type";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, {
    forwardRef,
    memo,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getActivityStats } from "../../utils/activity-stats.utils";
import { formatActivityDate } from "../../utils/utils";
import Drawer, { DrawerHandle } from "../ui/Drawer";
import RingChart from "../ui/RingChart";
import ActivityCardActionDrawer, {
    ActivityCardActionDrawerHandle,
} from "./ActivityCardActionDrawer";

export type ActivityDetailsDrawerHandle = DrawerHandle & {
    openWithActivity: (activity: Activity) => void;
};

const ActivityDetailsDrawer = forwardRef<ActivityDetailsDrawerHandle, {}>(
    (_, ref) => {
        const profile = useProfileStore((s) => s.profile);
        const drawerRef = useRef<ActivityDetailsDrawerHandle>(null);
        const activityCardActionDrawerRef =
            useRef<ActivityCardActionDrawerHandle>(null);
        const [activity, setActivity] = useState<Activity | null>(null);

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
            openWithActivity: (data: Activity) => {
                setActivity(data);
                drawerRef.current?.open();
            },
        }));

        if (!activity) {
            return (
                <Drawer ref={drawerRef}>
                    <View className="p-6 items-center justify-center">
                        <Text className="text-sm text-muted-foreground">
                            No activity selected
                        </Text>
                    </View>
                </Drawer>
            );
        }

        const start = new Date(activity.startTime);
        const end = new Date(activity.endTime);
        const pct = (activity.steps / activity.goal) * 100;
        const met = activity.steps >= activity.goal;
        const remaining = Math.max(activity.goal - activity.steps, 0);

        const stats = getActivityStats({
            activities: [activity],
            profile,
            fields: ["duration", "distance", "calories"],
        });
        const distanceKm = stats.find((s) => s.label === "Distance")?.value;
        const caloriesBurned = stats.find((s) => s.label === "Calories")?.value;

        return (
            <>
                <Drawer ref={drawerRef}>
                    <ColView className="gap-0">
                        <ColView className="gap-5 px-5 pt-3 pb-6">
                            {/* ── Header row ── */}
                            <RowView className="justify-between items-start">
                                <ColView className="gap-0.5 flex-1 pr-3">
                                    <Text className="text-base font-medium text-foreground">
                                        Activity details
                                    </Text>
                                    <Text className="text-[11px] text-muted-foreground">
                                        <Text>
                                            {formatActivityDate(start)}
                                            {", "}
                                            {format(start, "MMM d")}
                                        </Text>{" "}
                                        · {format(start, "p")} –{" "}
                                        {format(end, "p")}
                                    </Text>
                                </ColView>
                                <TouchableOpacity
                                    onPress={() => {
                                        activityCardActionDrawerRef.current?.openWithActivityId(
                                            activity.id,
                                        );
                                    }}
                                >
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={20}
                                        className="text-foreground"
                                    />
                                </TouchableOpacity>
                            </RowView>

                            {/* ── Hero: step count ── */}
                            <RowView className="justify-between">
                                <ColView className="gap-0">
                                    <RowView className="items-baseline gap-1.5">
                                        <Text className="text-[40px] leading-none font-medium text-primary">
                                            {activity.steps.toLocaleString()}
                                        </Text>
                                        <Text className="text-xs text-muted-foreground">
                                            steps
                                        </Text>
                                    </RowView>
                                    <Text className="text-[11px] text-muted-foreground">
                                        {met
                                            ? `${activity.goal.toLocaleString()} goal · exceeded by ${(activity.steps - activity.goal).toLocaleString()}`
                                            : `${remaining.toLocaleString()} steps to reach ${activity.goal.toLocaleString()} goal`}
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
                                        <Text className="text-base">%</Text>
                                    </Text>
                                </View>
                            </RowView>
                            {/* ── Divider ── */}
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

                            {/* ── Divider ── */}
                            <View className="border-b border-border/40" />

                            <RowView className="items-center bg-muted p-4 rounded">
                                <Text className="text-xs text-muted-foreground flex-1">
                                    You walked {distanceKm} km and burned{" "}
                                    {caloriesBurned} kcal in this session.
                                </Text>
                            </RowView>
                        </ColView>
                    </ColView>
                </Drawer>

                <ActivityCardActionDrawer
                    ref={activityCardActionDrawerRef}
                    onClose={() => drawerRef.current?.close()}
                />
            </>
        );
    },
);

export default memo(ActivityDetailsDrawer);
