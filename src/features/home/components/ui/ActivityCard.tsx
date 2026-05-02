import { ColView, RowView } from "@/shared/components/CustomView";
import ActivityCardActionDrawer, {
    ActivityCardActionDrawerHandle,
} from "@/shared/components/drawer/ActivityCardActionDrawer";
import ActivityDetailsDrawer, {
    ActivityDetailsDrawerHandle,
} from "@/shared/components/drawer/ActivityDetailsDrawer";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import { useUserStore } from "@/shared/stores/use-user.store";
import { Activity } from "@/shared/types/type";
import { getActivityStats } from "@/shared/utils/activity-stats.utils";
import { cn } from "@/shared/utils/cn";
import { formatActivityDate } from "@/shared/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    activity: Activity;
    className?: string;
    showDay?: boolean;
    showStats?: boolean;
}
function ActivityCard({
    activity,
    className,
    showDay = true,
    showStats = false,
}: Props) {
    const profile = useUserStore((s) => s.profile);
    const activityDetailsDrawerRef = useRef<ActivityDetailsDrawerHandle>(null);

    const activityCardActionDrawerRef =
        useRef<ActivityCardActionDrawerHandle>(null);
    const start = new Date(activity.startTime);
    const end = new Date(activity.endTime);
    const progress = Math.min((activity.steps / activity.goalStep) * 100, 100);
    const met = activity.steps >= activity.goalStep;
    const stats = getActivityStats({
        activities: [activity],
        profile,
        fields: ["duration", "distance", "calories"],
    });
    return (
        <>
            <TouchableOpacity
                key={activity.id}
                onPress={() => {
                    activityDetailsDrawerRef.current?.open();
                    activityDetailsDrawerRef.current?.openWithActivity?.(
                        activity,
                    );
                }}
                onLongPress={() => {
                    activityCardActionDrawerRef.current?.open();
                    activityCardActionDrawerRef.current?.openWithActivityId(
                        activity.id,
                    );
                }}
            >
                <Card className={cn("", className)}>
                    <ColView className="gap-4">
                        <RowView className="items-center gap-4">
                            <ColView className="flex-1 gap-1">
                                <Text className="text-[11px] text-muted-foreground">
                                    {showDay &&
                                        `${formatActivityDate(start)} · `}
                                    {format(start, "p")} – {format(end, "p")}
                                </Text>
                                <RowView className="items-baseline gap-1">
                                    <Text className="text-[22px] leading-none font-medium text-foreground">
                                        {activity.steps.toLocaleString()}
                                    </Text>
                                    <Text className="text-[11px] text-muted-foreground">
                                        / {activity.goalStep.toLocaleString()}{" "}
                                        steps
                                    </Text>
                                </RowView>
                            </ColView>

                            <View className="relative items-center justify-center">
                                <RingChart
                                    pct={progress}
                                    radius={20}
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    trackColor="rgba(128,128,128,0.1)"
                                    trackWidth={3}
                                />
                                <Text className="absolute text-[10px] font-medium text-primary">
                                    {Math.round(progress)}%
                                </Text>
                            </View>
                        </RowView>
                        {showStats && (
                            <>
                                <View className="border-b border-border/40" />
                                <RowView className="gap-4">
                                    {stats.map((stat) => {
                                        return (
                                            <ColView
                                                key={stat.label}
                                                className="flex-1 gap-0"
                                            >
                                                <RowView className="items-center gap-1">
                                                    <Ionicons
                                                        name={stat.icon}
                                                        size={12}
                                                        className="text-primary"
                                                    />
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
                            </>
                        )}
                    </ColView>
                </Card>
            </TouchableOpacity>
            <ActivityDetailsDrawer ref={activityDetailsDrawerRef} />
            <ActivityCardActionDrawer ref={activityCardActionDrawerRef} />
        </>
    );
}
export default memo(ActivityCard);
