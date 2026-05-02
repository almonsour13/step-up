import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useUserStore } from "@/shared/stores/use-user.store";
import { getActivityStats } from "@/shared/utils/activity-stats.utils";
import { useMemo } from "react";

export const useTodayActivity = () => {
    const profile = useUserStore((s) => s.profile);
    const activities = useActivityStore((s) => s.activities);

    return useMemo(() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const filtered = activities.filter((activity) => {
            const createdAt = new Date(activity.createdAt);
            return createdAt >= startOfToday && createdAt <= endOfToday;
        });

        const totalSteps = filtered.reduce((sum, a) => sum + a.steps, 0);
        const totalGoalSteps = filtered.reduce(
            (sum, a) => sum + (a.goalStep ?? 0),
            0,
        );
        const remainingSteps = Math.max(totalGoalSteps - totalSteps, 0);
        const totalPct = Math.min((totalSteps / totalGoalSteps) * 100, 100);
        const stats = getActivityStats({
            activities: filtered,
            profile,
            fields: ["duration", "distance", "calories"],
        });

        return {
            date: startOfToday,
            todayActivities: filtered,
            totalSteps,
            totalGoalSteps,
            remainingSteps,
            totalPct,
            stats,
        };
    }, [activities]);
};
