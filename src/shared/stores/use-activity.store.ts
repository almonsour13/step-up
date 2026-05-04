import { create } from "zustand";
import { Activity } from "../types/type";

type ActivityState = {
    lastUpdated: number;
    notifyUpdate: () => void;
    isRefreshing: boolean;
    setIsRefreshing: (isRefreshing: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    activities: Activity[];
    setActivities: (activities: Activity[]) => void;
    addActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    clearActivities: () => void;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
    lastUpdated: Date.now(),
    notifyUpdate: () => set({ lastUpdated: Date.now() }),
    isRefreshing: false,
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),
    activities: [],
    setActivities: (activities) => set({ activities }),
    addActivity: (activity) =>
        set((state) => ({
            activities: [activity, ...state.activities],
        })),
    deleteActivity: (id) =>
        set((state) => ({
            activities: state.activities.filter(
                (activity) => activity.id !== id,
            ),
        })),
    clearActivities: () => set({ activities: [] }),
}));
