import { create } from "zustand";
import { Activity } from "../types/type";

type ActivityState = {
    activities: Activity[];
    setActivities: (activities: Activity[]) => void;
    addActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    clearActivities: () => void;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
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
