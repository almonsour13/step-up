import { ColView, RowView } from "@/shared/components/CustomView";
import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/drawer/ActivitySessionsDrawer";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import clsx from "clsx";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { memo, useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

function WeekActivity() {
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);
    const isLoading = useActivityStore((s) => s.isLoading);
    const activities = useActivityStore((s) => s.activities);
    const today = new Date();

    const weekActivity = useMemo(() => {
        const map = new Map<string, typeof activities>();
        activities.forEach((a) => {
            const key = new Date(a.createdAt).toDateString();
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(a);
        });
        const start = startOfWeek(today, { weekStartsOn: 0 });

        const result = Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(start, i);
            const key = date.toDateString();
            const dayActivities = map.get(key) ?? [];

            const steps = dayActivities.reduce((sum, a) => sum + a.steps, 0);
            const goal =
                dayActivities.reduce((sum, a) => sum + (a.goal ?? 0), 0) ||
                10000;
            const pct = goal > 0 ? Math.min((steps / goal) * 100, 100) : 0;

            return {
                date,
                label: format(date, "EEE"),
                dayNumber: format(date, "d"),
                steps,
                goal,
                pct,
                isToday: isSameDay(date, today),
                isFuture: date > today,
            };
        });
        return result;
    }, [activities]);

    const totalSteps = weekActivity
        .filter((d) => !d.isFuture)
        .reduce((a, b) => a + b.steps, 0);
    const totalGoal = weekActivity
        .filter((d) => !d.isFuture)
        .reduce((a, b) => a + b.goal, 0);
    const totalPct = totalGoal > 0 ? (totalSteps / totalGoal) * 100 : 0;

    const streak = (() => {
        let count = 0;
        for (let i = weekActivity.length - 1; i >= 0; i--) {
            if (weekActivity[i].isFuture) continue;
            if (weekActivity[i].pct >= 100) count++;
            else break;
        }
        return count;
    })();

    const motivation = (() => {
        if (totalPct >= 90) return { emoji: "🔥", text: "On fire this week!" };
        if (totalPct >= 70)
            return { emoji: "💪", text: "Strong week, keep it up!" };
        if (totalPct >= 50)
            return { emoji: "👟", text: "Halfway there, push on!" };
        if (totalPct >= 25) return { emoji: "🚶", text: "Every step counts!" };
        return { emoji: "✨", text: "Let's get moving!" };
    })();

    return (
        <View className="px-4">
            {isLoading ? (
                <Card className="bg-primary h-60" />
            ) : (
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
                                    {weekActivity.length === 7 && (
                                        <Text className="text-xs text-white/60">
                                            {format(
                                                weekActivity[0].date,
                                                "MMM d",
                                            )}{" "}
                                            –{" "}
                                            {format(
                                                weekActivity[6].date,
                                                "MMM d",
                                            )}
                                        </Text>
                                    )}
                                </RowView>
                            </RowView>
                            <RowView className="items-baseline gap-1.5">
                                <Text className="text-5xl leading-none font-medium text-white">
                                    {totalSteps.toLocaleString()}{" "}
                                    <Text className="text-white/60 text-base">
                                        steps
                                    </Text>
                                </Text>
                            </RowView>
                        </ColView>

                        {/* Weekly Bars */}
                        <RowView className="items-end gap-1 ">
                            {weekActivity.map((day, i) => {
                                const isToday = isSameDay(day.date, today);

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        disabled={day.isFuture}
                                        className="flex-1 items-center gap-1"
                                        onPress={() => {
                                            activitySessionsDrawerRef.current?.openWithActivities?.(
                                                day.date.toDateString(),
                                            );
                                        }}
                                    >
                                        <View className="light h-16 w-full justify-end bg-foreground/16 rounded overflow-hidden">
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
                                    {/* {motivation.emoji} */}
                                    {motivation.text}
                                </Text>
                                <Text className="text-sm text-white">
                                    {totalPct.toFixed(0)}%
                                </Text>
                            </RowView>
                        </ColView>
                    </ColView>
                </Card>
            )}
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </View>
    );
}
export default memo(WeekActivity);
