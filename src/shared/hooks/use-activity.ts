import { useEffect } from "react";
import { activityStorageService } from "../services/activity-storage.service";
import { useActivityStore } from "../stores/use-activity.store";

export const useActivity = () => {
    const setActivities = useActivityStore((s) => s.setActivities);
    useEffect(() => {
        async function fetchActivities() {
            const activities = await activityStorageService.getAll();
            setActivities(activities);
        }
        fetchActivities();
    }, []);
};
