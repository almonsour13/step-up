import { create } from "zustand";
import { ActivityStatus } from "../types/type";

type ActiveActivity = {
    status: ActivityStatus;
    duration: number;
    steps: number;
    goalSteps: number;
};

type ActiveActivityState = {
    activeActivity: ActiveActivity;

    setActiveActivity: (activity: ActiveActivity) => void;
    clearActiveActivity: () => void;

    setActiveDuration: (duration: number) => void;
    setActiveStatus: (status: ActivityStatus) => void;
    setActiveSteps: (steps: number) => void;
    setActiveGoalSteps: (steps: number) => void;
};

const INITIAL_STATE: ActiveActivity = {
    status: "idle",
    duration: 0,
    steps: 0,
    goalSteps: 10000,
};

export const useActiveActivityStore = create<ActiveActivityState>((set) => ({
    activeActivity: INITIAL_STATE,

    setActiveActivity: (activeActivity) => set({ activeActivity }),

    clearActiveActivity: () => set({ activeActivity: INITIAL_STATE }),

    setActiveDuration: (duration) =>
        set((state) => ({
            activeActivity: {
                ...state.activeActivity,
                duration,
            },
        })),

    setActiveStatus: (status) =>
        set((state) => ({
            activeActivity: {
                ...state.activeActivity,
                status,
            },
        })),

    setActiveSteps: (steps) =>
        set((state) => ({
            activeActivity: {
                ...state.activeActivity,
                steps,
            },
        })),
    setActiveGoalSteps: (steps) =>
        set((state) => ({
            activeActivity: {
                ...state.activeActivity,
                goalSteps: steps,
            },
        })),
}));
