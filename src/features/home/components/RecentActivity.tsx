import ActivityDetailsDrawer, {
    ActivityDetailsDrawerHandle,
} from "@/shared/components/ActivityDetailsDrawer";
import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import { format, isToday, isYesterday } from "date-fns";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecentActivities } from "../hooks/use-recent-activity";

function formatActivityDate(date: Date) {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
}

export default function RecentActivity() {
    const recentActivities = useRecentActivities();
    const router = useRouter();
    const drawerRef = useRef<ActivityDetailsDrawerHandle>(null);
    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between items-center">
                <Text className="text-base font-medium text-foreground">
                    Recent activity
                </Text>
                <TouchableOpacity onPress={() => router.push("/history")}>
                    <Text className="text-sm text-primary">See all</Text>
                </TouchableOpacity>
            </RowView>

            <ColView className="px-4 gap-2">
                {recentActivities.length === 0 ? (
                    <Card>
                        <RowView className="items-center gap-4">
                            <View className="flex-1 gap-1">
                                <Text className="text-[11px] text-muted-foreground">
                                    No activity yet
                                </Text>

                                <Text className="text-[22px] leading-none font-medium text-foreground">
                                    0 steps
                                </Text>

                                <Text className="text-[11px] text-muted-foreground">
                                    Start your first run to track progress
                                </Text>
                            </View>
                        </RowView>
                    </Card>
                ) : (
                    recentActivities.map((activity, i) => {
                        const start = new Date(activity.startTime);
                        const end = new Date(activity.endTime);
                        const progress = Math.min(
                            (activity.steps / activity.goalStep) * 100,
                            100,
                        );
                        const met = activity.steps >= activity.goalStep;

                        return (
                            <TouchableOpacity
                                key={activity.id}
                                onPress={() => {
                                    drawerRef.current?.open();
                                    drawerRef.current?.openWithActivity?.(
                                        activity,
                                    );
                                }}
                            >
                                <Card>
                                    <RowView className="items-center gap-4">
                                        <ColView className="flex-1 gap-1">
                                            <Text className="text-[11px] text-muted-foreground">
                                                {formatActivityDate(start)} ·{" "}
                                                {format(start, "p")} –{" "}
                                                {format(end, "p")}
                                            </Text>
                                            <RowView className="items-baseline gap-1">
                                                <Text className="text-[22px] leading-none font-medium text-foreground">
                                                    {activity.steps.toLocaleString()}
                                                </Text>
                                                <Text className="text-[11px] text-muted-foreground">
                                                    /{" "}
                                                    {activity.goalStep.toLocaleString()}{" "}
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
                                                color={
                                                    met ? "#639922" : "white"
                                                }
                                            />
                                            <Text className="absolute text-[10px] font-medium text-primary">
                                                {Math.round(progress)}%
                                            </Text>
                                        </View>
                                    </RowView>
                                </Card>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ColView>

            <ActivityDetailsDrawer ref={drawerRef} />
        </ColView>
    );
}
