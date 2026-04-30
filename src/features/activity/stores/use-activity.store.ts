import { activityService } from "@/shared/services/activity.service";
import { create } from "zustand";

export type ActivityStatus = "idle" | "active" | "paused";

type ActivityState = {
    status: ActivityStatus;
    duration: number;
    steps: number;
};

type ActivityAction = {
    setStatus: (status: ActivityStatus) => void;
    setDuration: (duration: number) => void;
    setSteps: (steps: number) => void;
    start: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    stop: () => Promise<void>;
    discard: () => Promise<void>;
};

const INITIAL_STATE: ActivityState = {
    status: "idle",
    duration: 0,
    steps: 0,
};

export const useActivityStore = create<ActivityState & ActivityAction>(
    (set) => ({
        ...INITIAL_STATE,
        setStatus: (status) => set({ status }),
        setDuration: (duration) => set({ duration }),
        setSteps: (steps) => set({ steps }),

        start: async () => {
            await activityService.start();
            set({ status: "active" });
        },
        pause: async () => {
            await activityService.pause();
            set({ status: "paused" });
        },
        resume: async () => {
            await activityService.resume();
            set({ status: "active" });
        },
        stop: async () => {
            await activityService.stop();
            set(INITIAL_STATE);
        },
        discard: async () => {
            await activityService.discard();
            set(INITIAL_STATE);
        },
    }),
);
