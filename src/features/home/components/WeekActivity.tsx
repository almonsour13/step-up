import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/ActivitySessionsDrawer";
import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import clsx from "clsx";
import { format, isSameDay } from "date-fns";
import { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useWeekActivity } from "../hooks/use-week-activity";

function getMotivation(pct: number) {
    if (pct >= 90) return { emoji: "🔥", text: "On fire this week!" };
    if (pct >= 70) return { emoji: "💪", text: "Strong week, keep it up!" };
    if (pct >= 50) return { emoji: "👟", text: "Halfway there, push on!" };
    if (pct >= 25) return { emoji: "🚶", text: "Every step counts!" };
    return { emoji: "✨", text: "Let's get moving!" };
}
function WeekActivity() {
    const days = useWeekActivity();
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);

    const totalSteps = days
        .filter((d) => !d.isFuture)
        .reduce((a, b) => a + b.steps, 0);
    const totalGoal = days
        .filter((d) => !d.isFuture)
        .reduce((a, b) => a + b.goal, 0);
    const totalPct = totalGoal > 0 ? (totalSteps / totalGoal) * 100 : 0;

    const streak = (() => {
        let count = 0;
        for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].isFuture) continue;
            if (days[i].pct >= 100) count++;
            else break;
        }
        return count;
    })();

    const today = new Date();
    const motivation = getMotivation(totalPct);
    return (
        <View className="px-4">
            <Card className="bg-primary p-4 border-0">
                <ColView className="gap-4">
                    {/* Header */}
                    <ColView className="gap-2">
                        <RowView className="justify-between ">
                            <Text className="text-xs tracking-widest uppercase text-white/60">
                                This Week
                            </Text>
                            <RowView className="gap-2 items-center">
                                {streak > 0 && (
                                    <View className="px-2 py-0.5 rounded-full bg-white/10">
                                        <Text className="text-xs text-white">
                                            🔥 {streak} day streak
                                        </Text>
                                    </View>
                                )}
                                <Text className="text-xs text-white/60">
                                    {format(days[0].date, "MMM d")} –{" "}
                                    {format(days[6].date, "MMM d")}
                                </Text>
                            </RowView>
                        </RowView>
                        <RowView className="items-baseline gap-1.5">
                            <Text className="text-5xl leading-none font-medium text-white">
                                {totalSteps.toLocaleString()}
                            </Text>
                            <Text className="text-sm text-white/60">steps</Text>
                        </RowView>
                    </ColView>

                    {/* Weekly Bars */}
                    <RowView className="items-end gap-1 ">
                        {days.map((day, i) => {
                            const isToday = isSameDay(day.date, today);

                            return (
                                <TouchableOpacity
                                    key={i}
                                    disabled={day.isFuture}
                                    className="flex-1 items-center gap-1"
                                    onPress={() => {
                                        activitySessionsDrawerRef.current?.open();
                                        activitySessionsDrawerRef.current?.openWithActivities?.(
                                            day.activities,
                                        );
                                    }}
                                >
                                    <View className="h-16 w-full justify-end bg-foreground/16 rounded overflow-hidden">
                                        {!day.isFuture && (
                                            <View
                                                style={{
                                                    height: `${day.pct}%`,
                                                }}
                                                className={clsx(
                                                    "rounded",
                                                    isToday
                                                        ? "bg-white"
                                                        : "bg-white/50",
                                                )}
                                            />
                                        )}
                                    </View>

                                    <Text
                                        className={`text-xs ${
                                            isToday
                                                ? "text-white font-bold"
                                                : "text-white/60"
                                        }`}
                                    >
                                        {day.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </RowView>

                    {/* Footer / Summary */}
                    <ColView className="gap-2">
                        <View className="h-1 w-full bg-foreground/16 rounded">
                            <View
                                style={{
                                    width: `${totalPct}%`,
                                }}
                                className="h-1 bg-white rounded"
                            />
                        </View>

                        <RowView className="justify-between">
                            <Text className="text-sm text-white/80">
                                {motivation.emoji} {motivation.text}
                            </Text>
                            <Text className="text-sm text-white">
                                {totalPct.toFixed(0)}%
                            </Text>
                        </RowView>
                    </ColView>
                </ColView>
            </Card>
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </View>
    );
}
export default memo(WeekActivity);
