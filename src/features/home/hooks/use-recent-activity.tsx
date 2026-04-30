import { activityStorageService } from "@/shared/services/activity-storage.service";
import { useEffect } from "react";
import { useRecentActivityStore } from "../stores/use-recent-activity.store";

export const useRecentActivity = () => {
    const setRecentActivities = useRecentActivityStore(
        (s) => s.setRecentActivities,
    );

    async function fetchActivities() {
        const data = await activityStorageService.getAll();
        setRecentActivities(data);
    }
    useEffect(() => {
        fetchActivities();
    }, []);
};
