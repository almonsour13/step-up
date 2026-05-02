import { ColView, RowView } from "@/shared/components/CustomView";
import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/drawer/ActivitySessionsDrawer";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import Ionicons from "@expo/vector-icons/Ionicons";
import { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTodayActivity } from "../hooks/use-today-activity";

function TodayActivity() {
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);
    const {
        date,
        totalSteps,
        totalGoalSteps,
        remainingSteps,
        totalPct,
        stats,
        todayActivities,
    } = useTodayActivity();

    const met = totalSteps >= totalGoalSteps;
    return (
        <>
            <ColView className="gap-2">
                <RowView className="px-4 justify-between items-center">
                    <Text className="text-base font-medium text-foreground">
                        Today's activity
                    </Text>
                    {todayActivities.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                activitySessionsDrawerRef.current?.openWithActivities?.(
                                    date.toDateString(),
                                );
                            }}
                        >
                            <Text className="text-sm text-primary">
                                {todayActivities.length} session
                                {todayActivities.length > 1 ? "s" : ""}
                            </Text>
                        </TouchableOpacity>
                    )}
                </RowView>

                <ColView className="px-4 gap-1">
                    {/* Steps card */}
                    <Card className="w-full">
                        <ColView className="gap-4">
                            <RowView className="justify-between items-center">
                                <ColView className="gap-1">
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
                                            ? `${totalSteps.toLocaleString()} goal · exceeded by ${(totalSteps - totalGoalSteps).toLocaleString()}`
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
                                        <Text className="text-[9px]">%</Text>
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
                </ColView>
            </ColView>
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </>
    );
}

export default memo(TodayActivity);
