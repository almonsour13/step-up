import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useMemo } from "react";

export const useRecentActivities = (limit = 10) => {
    const activities = useActivityStore((s) => s.activities);

    return useMemo(() => {
        return activities
            .slice() // avoid mutating original array
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(0, limit);
    }, [activities, limit]);
};
