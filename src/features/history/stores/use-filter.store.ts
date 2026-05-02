import { create } from "zustand";

export type SortType = "newest" | "oldest";
export type PeriodType = "all" | "week" | "month";

type FilterStoreType = {
    sort: SortType;
    period: PeriodType;
    setSort: (sort: SortType) => void;
    setPeriod: (period: PeriodType) => void;
};

export const useFilterStore = create<FilterStoreType>((set) => ({
    sort: "newest",
    period: "all",
    setSort: (sort) => set({ sort }),
    setPeriod: (period) => set({ period }),
}));
