import { activityService } from "@/shared/services/activity.service";
import { useEffect } from "react";
import { useActivityStore } from "../stores/use-activity.store";

export const useActivityState = () => {
    const setDuration = useActivityStore((s) => s.setDuration);
    const setSteps = useActivityStore((s) => s.setSteps);

    useEffect(() => {
        return activityService.onStatsUpdate((stats) => {
            setDuration(stats.duration);
            setSteps(stats.steps);
            console.log("[feature:Activity: use acitivity stats hook]", stats);
        });
    }, []);
};
