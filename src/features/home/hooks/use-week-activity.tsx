import { useActivityStore } from "@/shared/stores/use-activity.store";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useMemo } from "react";

export const useWeekActivity = () => {
    const activities = useActivityStore((s) => s.activities);

    return useMemo(() => {
        const today = new Date();

        const start = startOfWeek(today, { weekStartsOn: 1 });

        const map = new Map<string, typeof activities>();

        activities.forEach((a) => {
            const key = new Date(a.createdAt).toDateString();

            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(a);
        });

        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(start, i);

            const key = date.toDateString();
            const dayActivities = map.get(key) ?? [];

            const steps = dayActivities.reduce((sum, a) => sum + a.steps, 0);

            const goal =
                dayActivities.reduce((sum, a) => sum + (a.goalStep ?? 0), 0) ||
                10000;

            const pct = goal > 0 ? Math.min((steps / goal) * 100, 100) : 0;

            return {
                activities: dayActivities,
                date,
                label: format(date, "EEE"),
                dayNumber: format(date, "d"),
                steps,
                goal,
                pct,
                isToday: isSameDay(date, today),
                isFuture: date > today,
            };
        });
    }, [activities]);
};
