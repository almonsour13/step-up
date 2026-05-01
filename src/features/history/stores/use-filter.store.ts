import { create } from "zustand";

export type SortType = "Newest" | "Oldest";
export type PeriodType = "All" | "Week" | "Month";

type FilterStoreType = {
    sort: SortType;
    period: PeriodType;
    setSort: (sort: SortType) => void;
    setPeriod: (period: PeriodType) => void;
};

export const useFilterStore = create<FilterStoreType>((set) => ({
    sort: "Newest",
    period: "All",
    setSort: (sort) => set({ sort }),
    setPeriod: (period) => set({ period }),
}));
