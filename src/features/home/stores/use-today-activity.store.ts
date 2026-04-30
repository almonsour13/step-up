import { Activity } from "@/shared/types/type";
import { create } from "zustand";

type TodayActivityState = {
    isLoading: boolean;
    TodayActivities: Activity[];
};

type TodayActivityAction = {
    setIsLoading: (value: boolean) => void;
    setTodayActivities: (activities: Activity[]) => void;
    addTodayActivity: (activity: Activity) => void;
};

const INITIAL_STATE: TodayActivityState = {
    isLoading: true,
    TodayActivities: [],
};

export const useTodayActivityStore = create<
    TodayActivityState & TodayActivityAction
>((set) => ({
    ...INITIAL_STATE,

    setIsLoading: (value) =>
        set({
            isLoading: value,
        }),

    setTodayActivities: (activities) =>
        set({
            TodayActivities: activities,
        }),
    addTodayActivity: (activity) =>
        set((state) => ({
            TodayActivities: [...state.TodayActivities, activity],
        })),
}));
