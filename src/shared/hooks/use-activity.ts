import { useEffect, useRef } from "react";
import { activityService } from "../services/storage/activity.service";
import { useActivityStore } from "../stores/use-activity.store";

export const useActivity = () => {
    const setIsLoading = useActivityStore((s) => s.setIsLoading);
    const setActivities = useActivityStore((s) => s.setActivities);
    const setIsRefreshing = useActivityStore((s) => s.setIsRefreshing);

    const isRefreshingRef = useRef(false);
    const isFetchingPageRef = useRef(false);

    async function fetchActivities() {
        if (isFetchingPageRef.current) return;
        try {
            isFetchingPageRef.current = true;
            setIsLoading(true);
            const activities = await activityService.get();
            setActivities(activities);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            isFetchingPageRef.current = false;
        }
    }
    useEffect(() => {
        fetchActivities();
    }, []);

    const handleRefresh = async () => {
        isRefreshingRef.current = true;
        isFetchingPageRef.current = false;
        setIsRefreshing(true);
        await fetchActivities();
        setIsRefreshing(false);
        isRefreshingRef.current = false;
    };
    return {
        handleRefresh,
    };
};
