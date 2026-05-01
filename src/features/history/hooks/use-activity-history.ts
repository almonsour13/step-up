import { useActivityStore } from "@/shared/stores/use-activity.store";
import { Activity } from "@/shared/types/type";
import { format, isAfter, startOfWeek, subMonths } from "date-fns";
import { useMemo } from "react";
import { useFilterStore } from "../stores/use-filter.store";

type GroupedActivities = Record<string, Activity[]>;

export type PeriodType = "All" | "Week" | "Month";

export const useActivityHistory = () => {
    const activities = useActivityStore((s) => s.activities);
    const sort = useFilterStore((s) => s.sort);
    const period = useFilterStore((s) => s.period);

    return useMemo<GroupedActivities>(() => {
        const now = new Date();

        // 1. FILTER BY PERIOD
        const filtered = activities.filter((activity) => {
            const date = new Date(activity.startTime);

            if (period === "Week") {
                return isAfter(date, startOfWeek(now, { weekStartsOn: 1 }));
            }

            if (period === "Month") {
                return isAfter(date, subMonths(now, 1));
            }

            return true; // "All"
        });

        // 2. GROUP BY DATE
        const grouped = filtered.reduce((acc, activity) => {
            const key = format(new Date(activity.startTime), "yyyy-MM-dd");

            if (!acc[key]) acc[key] = [];
            acc[key].push(activity);

            return acc;
        }, {} as GroupedActivities);

        // 3. SORT DATES
        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            if (sort === "Newest") {
                return new Date(b).getTime() - new Date(a).getTime();
            }
            return new Date(a).getTime() - new Date(b).getTime();
        });

        // 4. REBUILD ORDERED OBJECT
        const sortedGrouped: GroupedActivities = {};
        sortedKeys.forEach((key) => {
            sortedGrouped[key] = grouped[key];
        });

        return sortedGrouped;
    }, [activities, sort, period]);
};
