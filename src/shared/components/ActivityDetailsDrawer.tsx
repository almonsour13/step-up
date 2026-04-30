import { ColView, RowView } from "@/shared/components/CustomView";
import { Activity } from "@/shared/types/type";
import {
    calcCalories,
    calcDistanceKm,
    formatDuration,
} from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Text, View } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";
import Drawer, { DrawerHandle } from "./Drawer";

const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};
export type ActivityDetailsDrawerHandle = DrawerHandle & {
    openWithActivity: (activity: Activity) => void;
};
type Props = {};

const ActivityDetailsDrawer = forwardRef<ActivityDetailsDrawerHandle, Props>(
    (_, ref) => {
        const activities = useActivityStore((s) => s.activities);
        const drawerRef = useRef<ActivityDetailsDrawerHandle>(null);
        const [activity, setActivity] = useState<Activity | null>(null);

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
            openWithActivity: openWithActivity,
        }));

        const openWithActivity = (data: Activity) => {
            setActivity(data);
            drawerRef.current?.open();
        };

        const start = activity ? new Date(activity.startTime) : null;
        const end = activity ? new Date(activity.endTime) : null;

        if (!activity) {
            return (
                <Drawer ref={drawerRef}>
                    <View className="p-4">
                        <Text className="text-muted-foreground">
                            No activity selected
                        </Text>
                    </View>
                </Drawer>
            );
        }

        const progress =
            (activity.steps / (activity.goalStep || activity.steps)) * 100;

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
                value: calcCalories(activity.steps, TEMP_USER.weightKg).toFixed(
                    1,
                ),
                unit: "kcal",
                icon: "flame" as const,
            },
        ];

        return (
            <Drawer ref={drawerRef}>
                <ColView className="gap-4 p-4">
                    {/* Header */}
                    <ColView className="gap-1">
                        <Text className="text-lg font-semibold text-foreground">
                            Activity Details
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                            {start &&
                                `${format(start, "PPP p")} → ${format(end!, "p")}`}
                        </Text>
                    </ColView>
                    <Text className="text-3xl font-bold text-foreground">
                        {activity.steps.toLocaleString()}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                        / {activity.goalStep.toLocaleString()} steps
                    </Text>

                    <View className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                        <View
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </View>

                    <RowView className="justify-between">
                        {stats.map((s) => (
                            <ColView key={s.label} className="items-center">
                                <RowView className="items-center gap-1">
                                    <Ionicons
                                        name={s.icon}
                                        size={14}
                                        color="#888"
                                    />
                                    <Text className="text-sm font-semibold">
                                        {s.value} {s.unit}
                                    </Text>
                                </RowView>
                                <Text className="text-xs text-muted-foreground">
                                    {s.label}
                                </Text>
                            </ColView>
                        ))}
                    </RowView>
                </ColView>
            </Drawer>
        );
    },
);

export default ActivityDetailsDrawer;
