import { useEffect } from "react";
import { activityStorageService } from "../services/storage/activity.storage.service";
import { useActivityStore } from "../stores/use-activity.store";

export const useActivity = () => {
    const setActivities = useActivityStore((s) => s.setActivities);
    useEffect(() => {
        async function fetchActivities() {
            const activities = await activityStorageService.getAll();
            // const activities = generateActivities({
            //     months: 2,
            //     minSessionsPerDay: 2,
            //     maxSessionsPerDay: 6,
            // });
            setActivities(activities);
        }
        fetchActivities();
    }, []);
};
