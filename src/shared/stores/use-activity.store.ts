import { create } from "zustand";
import { Activity } from "../types/type";

type ActivityStatus = "idle" | "active" | "paused";
type ActvityAcitivty = {
    status: ActivityStatus;
    duration: number;
    steps: number;
    goalSteps: number;
};
type ActivityState = {
    activities: Activity[];
    currentSession: ActvityAcitivty | null;
    setActivities: (activities: Activity[]) => void;
    addActivity: (activity: Activity) => void;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
    activities: [],
    currentSession: null,

    setActivities: (activities) => set({ activities }),
    addActivity: (activity) =>
        set((state) => ({
            activities: [activity, ...state.activities],
        })),
}));
