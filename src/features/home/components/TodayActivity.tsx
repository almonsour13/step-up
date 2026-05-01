import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/ActivitySessionsDrawer";
import { ColView, RowView } from "@/shared/components/CustomView";
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
                                activitySessionsDrawerRef.current?.open();
                                activitySessionsDrawerRef.current?.openWithActivities?.(
                                    todayActivities,
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
                                    strokeWidth={6}
                                    strokeLinecap="round"
                                    trackColor="rgba(128,128,128,0.1)"
                                    color={met ? "#639922" : "white"}
                                />
                                <Text className="absolute text-[11px] font-medium text-primary">
                                    {totalPct.toFixed(0)}
                                    <Text className="text-[9px]">%</Text>
                                </Text>
                            </View>
                        </RowView>
                    </Card>

                    {/* Stat cards */}
                    <RowView className="gap-1">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="flex-1 gap-1.5">
                                <RowView className="gap-1">
                                    <Ionicons
                                        name={stat.icon}
                                        size={12}
                                        className="text-primary"
                                    />
                                    <Text className="text-xs text-muted-foreground">
                                        {stat.label}
                                    </Text>
                                </RowView>
                                <Text className="text-base leading-none font-medium text-foreground">
                                    {stat.value}
                                    {stat.unit && (
                                        <Text className="text-[10px] font-normal text-muted-foreground">
                                            {" "}
                                            {stat.unit}
                                        </Text>
                                    )}
                                </Text>
                            </Card>
                        ))}
                    </RowView>
                </ColView>
            </ColView>
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </>
    );
}

export default memo(TodayActivity);
