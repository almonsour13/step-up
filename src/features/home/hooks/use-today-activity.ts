import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useMemo } from "react";

const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};

export const useTodayActivity = () => {
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
        const totalDuration = filtered.reduce((sum, a) => sum + a.duration, 0);
        const totalCalories = Math.round(totalSteps * 0.04);
        const totalDistance = +(totalSteps * 0.0008).toFixed(2);
        const totalProgress = (totalSteps / totalGoalSteps) * 100;

        const totalSeconds = Math.floor(totalDuration / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const duration = `${hours}h ${mins}m`;

        const stats = [
            {
                label: "Duration",
                value: duration,
                icon: "time" as const,
            },
            {
                label: "Distance",
                value: totalDistance.toString(),
                unit: "km",
                icon: "location" as const,
            },
            {
                label: "Calories",
                value: totalCalories.toString(),
                unit: "kcal",
                icon: "flame" as const,
            },
        ];

        return {
            todayActivities: filtered,
            totalSteps,
            totalGoalSteps,
            totalProgress,
            stats,
        };
    }, [activities]);
};
