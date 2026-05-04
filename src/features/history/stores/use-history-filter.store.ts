import { ActivityFilters, PeriodType } from "@/shared/types/type";
import { create } from "zustand";

type ActivityFilterHistoryState = {
    filters: ActivityFilters;

    setFilters: (filters: ActivityFilters) => void;
    setSort: (sort: "newest" | "oldest") => void;
    setPeriod: (period: PeriodType) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setDayLimit: (dayLimit: number) => void;
};

export const useHistoryFilterStore = create<ActivityFilterHistoryState>(
    (set) => ({
        filters: {
            sort: "newest",
            period: "all",
            page: 1,
            dayLimit: 5,
        },

        setFilters: (filters) => set({ filters }),
        setSort: (sort) =>
            set((state) => ({ filters: { ...state.filters, sort } })),
        setPeriod: (period) =>
            set((state) => ({
                filters: { ...state.filters, period, page: 1 },
            })),
        setPage: (page) =>
            set((state) => ({ filters: { ...state.filters, page } })),
        setLimit: (limit) =>
            set((state) => ({ filters: { ...state.filters, limit } })),
        setDayLimit: (dayLimit) =>
            set((state) => ({ filters: { ...state.filters, dayLimit } })),
    }),
);
