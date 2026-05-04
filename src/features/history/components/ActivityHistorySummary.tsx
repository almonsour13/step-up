import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { StatItem } from "@/shared/types/type";
import { calcCalories, calcDistanceKm } from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { memo, useMemo } from "react";
import { useHistoryFilterStore } from "../stores/use-history-filter.store";

function ActivityHistorySummary() {
    const isLoading = useActivityStore((s) => s.isLoading);
    const activities = useActivityStore((s) => s.activities);
    const profile = useProfileStore((s) => s.profile);
    const period = useHistoryFilterStore((s) => s.filters.period);

    const { steps, duration, distance, calories, sessions } = useMemo(() => {
        const today = new Date();
        const filtered = activities.filter((a) => {
            const createdAt = new Date(a.createdAt);

            if (period === "week") {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - 7);
                startOfWeek.setHours(0, 0, 0, 0);

                return createdAt >= startOfWeek && createdAt <= today;
            }

            if (period === "month") {
                const startOfMonth = new Date(today);
                startOfMonth.setMonth(today.getMonth() - 1);
                startOfMonth.setHours(0, 0, 0, 0);

                return createdAt >= startOfMonth && createdAt <= today;
            }

            if (period === "year") {
                const startOfYear = new Date(today);
                startOfYear.setFullYear(today.getFullYear() - 1);
                startOfYear.setHours(0, 0, 0, 0);

                return createdAt >= startOfYear && createdAt <= today;
            }

            return true;
        });
        const steps = filtered.reduce((a, b) => a + b.steps, 0);
        const duration = filtered.reduce((sum, a) => sum + a.duration, 0);
        const distance = activities.reduce(
            (a, b) => a + calcDistanceKm(b.steps, profile?.height || 165),
            0,
        );
        const calories = activities.reduce(
            (a, b) => a + calcCalories(b.steps, profile?.weight || 65),
            0,
        );
        const sessions = filtered.length;
        return {
            steps,
            duration,
            distance,
            calories,
            sessions,
        };
    }, [activities, period, profile?.height, profile?.weight]);

    const activitySummary: StatItem[] = useMemo(
        () => [
            {
                label: "Steps",
                value: steps.toLocaleString(),
                unit: "",
                icon: "walk-outline",
            },
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
        ],
        [steps, distance, duration, calories],
    );
    return (
        <ColView className="px-4 gap-1">
            {isLoading ? (
                <>
                    <RowView className="justify-between gap-1">
                        <Card className="flex-1 h-20" />
                        <Card className="flex-1 h-20" />
                    </RowView>
                    <RowView className="justify-between gap-1">
                        <Card className="flex-1 h-20" />
                        <Card className="flex-1 h-20" />
                    </RowView>
                </>
            ) : (
                <>
                    <RowView className="gap-1">
                        {activitySummary.slice(0, 2).map((s) => (
                            <AcitivitySummaryCard key={s.label} stat={s} />
                        ))}
                    </RowView>
                    <RowView className="gap-1">
                        {activitySummary.slice(2).map((s) => (
                            <AcitivitySummaryCard key={s.label} stat={s} />
                        ))}
                    </RowView>
                </>
            )}
        </ColView>
    );
}
function AcitivitySummaryCard({ stat }: { stat: StatItem }) {
    return (
        <Card className="flex-1">
            <ColView className="gap-1">
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
                <Text className="text-2xl leading-none font-medium text-foreground">
                    {stat.value}
                    {stat.unit && (
                        <Text className="text-[10px] font-normal text-muted-foreground">
                            {" "}
                            {stat.unit}
                        </Text>
                    )}
                </Text>
            </ColView>
        </Card>
    );
}
export default memo(ActivityHistorySummary);
