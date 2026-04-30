import { Activity } from "@/shared/types/type";
import { create } from "zustand";

type RecentActivityState = {
    isLoading: boolean;
    recentActivities: Activity[];
};

type RecentActivityAction = {
    setIsLoading: (value: boolean) => void;
    setRecentActivities: (activities: Activity[]) => void;
    addRecentActivity: (activity: Activity) => void;
};

const INITIAL_STATE: RecentActivityState = {
    isLoading: true,
    recentActivities: [],
};

export const useRecentActivityStore = create<
    RecentActivityState & RecentActivityAction
>((set) => ({
    ...INITIAL_STATE,

    setIsLoading: (value) =>
        set({
            isLoading: value,
        }),

    setRecentActivities: (activities) =>
        set({
            recentActivities: activities,
        }),
    addRecentActivity: (activity) =>
        set((state) => ({
            recentActivities: [...state.recentActivities, activity],
        })),
}));
