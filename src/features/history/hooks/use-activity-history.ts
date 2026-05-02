import { useActivityStore } from "@/shared/stores/use-activity.store";
import { Activity } from "@/shared/types/type";
import {
    endOfWeek,
    format,
    isWithinInterval,
    startOfWeek,
    subMonths,
} from "date-fns";
import { useMemo } from "react";
import { useFilterStore } from "../stores/use-filter.store";

type GroupedActivities = Record<string, Activity[]>;

export type PeriodType = "all" | "week" | "month";

export const useActivityHistory = () => {
    const activities = useActivityStore((s) => s.activities);
    const sort = useFilterStore((s) => s.sort);
    const period = useFilterStore((s) => s.period);

    return useMemo<GroupedActivities>(() => {
        const now = new Date();
        const filtered = activities.filter((activity) => {
            const date = new Date(activity.startTime);

            if (period === "week") {
                return isWithinInterval(date, {
                    start: startOfWeek(now, { weekStartsOn: 1 }),
                    end: endOfWeek(now, { weekStartsOn: 1 }),
                });
            }

            if (period === "month") {
                return isWithinInterval(date, {
                    start: subMonths(now, 1),
                    end: now,
                });
            }

            return true;
        });

        const grouped = filtered.reduce((acc, activity) => {
            const key = format(new Date(activity.startTime), "yyyy-MM-dd");

            if (!acc[key]) acc[key] = [];
            acc[key].push(activity);

            return acc;
        }, {} as GroupedActivities);

        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            if (sort === "newest") {
                return new Date(b).getTime() - new Date(a).getTime();
            }
            return new Date(a).getTime() - new Date(b).getTime();
        });

        const sortedGrouped: GroupedActivities = {};
        sortedKeys.forEach((key) => {
            sortedGrouped[key] = grouped[key];
        });

        return sortedGrouped;
    }, [activities, sort, period]);
};
