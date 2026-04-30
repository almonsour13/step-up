import { activityStorageService } from "@/shared/services/activity-storage.service";
import { Activity } from "@/shared/types/type";
import { formatDuration } from "@/shared/utils/activity.utils";
import { useEffect, useMemo, useState } from "react";

const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};

export const useTodayActivity = () => {
    const [todayActivities, setTodayActivities] = useState<Activity[]>([]);

    async function fetchTodayActivities() {
        const data = await activityStorageService.getToday();
        setTodayActivities(data);
    }

    useEffect(() => {
        fetchTodayActivities();
    }, []);

    // ─── Aggregations ─────────────────────────────

    const totalSteps = useMemo(() => {
        return todayActivities.reduce((sum, a) => sum + a.steps, 0);
    }, [todayActivities]);

    const totalGoalSteps = useMemo(() => {
        return todayActivities.reduce((sum, a) => sum + (a.goalStep ?? 0), 0);
    }, [todayActivities]);

    const totalDuration = useMemo(() => {
        return todayActivities.reduce((sum, a) => sum + a.duration, 0);
    }, [todayActivities]);

    const totalCalories = useMemo(() => {
        // simple estimate (you can improve later)
        return Math.round(totalSteps * 0.04);
    }, [totalSteps]);

    const totalDistance = useMemo(() => {
        // rough estimate: 1 step ≈ 0.0008 km
        return +(totalSteps * 0.0008).toFixed(2);
    }, [totalSteps]);

    const totalProgress = useMemo(() => {
        if (totalGoalSteps === 0) return 0;
        return totalSteps / totalGoalSteps;
    }, [totalSteps, totalGoalSteps]);

    // ─── Stats UI ─────────────────────────────

    const stats = useMemo(
        () => [
            {
                label: "Duration",
                value: formatDuration(totalDuration),
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
        ],
        [totalDuration, totalDistance, totalCalories],
    );

    return {
        todayActivities,
        totalSteps,
        totalGoalSteps,
        totalProgress,
        stats,
    };
};
