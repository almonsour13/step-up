import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useUserStore } from "@/shared/stores/use-user.store";
import { getActivityStats } from "@/shared/utils/activity-stats.utils";
import { useMemo } from "react";

export const useActivityHistorySummar = () => {
    const profile = useUserStore((s) => s.profile);
    const activities = useActivityStore((s) => s.activities);
    return useMemo(() => {
        return getActivityStats({
            activities,
            profile,
            fields: ["steps", "duration", "distance", "calories"],
        });
    }, []);
};
