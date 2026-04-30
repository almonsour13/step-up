import { activityStorageService } from "@/shared/services/activity-storage.service";
import { Activity } from "@/shared/types/type";
import { useEffect, useState } from "react";

export const useActivityHistory = () => {
    const [activities, setActivities] = useState<Activity[] | []>([]);

    async function fetchActivities() {
        const data = await activityStorageService.getAll();
        setActivities(data);
    }
    useEffect(() => {
        fetchActivities();
    }, []);

    return {
        activities,
        setActivities,
    };
};
