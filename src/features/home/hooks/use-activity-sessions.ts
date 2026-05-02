import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useMemo } from "react";

export const useActivitySessions = (day: string | null) => {
    const activities = useActivityStore((s) => s.activities);

    return useMemo(() => {
        if (!day) return [];
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);

        const filtered = activities.filter((activity) => {
            const createdAt = new Date(activity.createdAt);
            return createdAt >= startOfDay && createdAt <= endOfDay;
        });

        return filtered;
    }, [activities, day]);
};
