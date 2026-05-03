import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import { useEffect } from "react";
import { activeActivityService } from "../services/active-activity.service";

export const useActiveActivity = () => {
    const { setActiveDuration, setActiveSteps, setActiveStatus } =
        useActiveActivityStore();

    useEffect(() => {
        activeActivityService.restore().then((stored) => {
            if (!stored) return;

            const metrics = activeActivityService.getCurrentMetrics();

            if (metrics) {
                setActiveDuration(metrics.duration);
                setActiveSteps(metrics.steps);
                if (metrics.status) {
                    setActiveStatus(metrics.status);
                }
                console.log(metrics);
            }
        });
    }, []);

    useEffect(() => {
        return activeActivityService.onStatsUpdate((stats) => {
            setActiveDuration(stats.duration);
            setActiveSteps(stats.steps);
        });
    }, []);
};
