import { activityService } from "@/shared/services/activity.service";
import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import { useEffect } from "react";

export const useActiveActivity = () => {
    const { setActiveDuration, setActiveSteps } = useActiveActivityStore();

    useEffect(() => {
        return activityService.onStatsUpdate((stats) => {
            setActiveDuration(stats.duration);
            setActiveSteps(stats.steps);
            console.log("[feature:Activity: use acitivity stats hook]", stats);
        });
    }, []);
};
