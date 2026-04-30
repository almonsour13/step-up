import {
    calcCalories,
    calcDistanceKm,
    formatDuration,
} from "@/shared/utils/activity.utils";
import { useActivityStore } from "../stores/use-activity.store";

const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};

type Stat = {
    label: string;
    value: string;
    unit?: string;
    icon: "time" | "location" | "flame";
};

export const useActivityStatistic = (): Stat[] => {
    const duration = useActivityStore((s) => s.duration);
    const steps = useActivityStore((s) => s.steps);

    return [
        {
            label: "Duration",
            value: formatDuration(duration),
            icon: "time",
        },
        {
            label: "Distance",
            value: calcDistanceKm(steps, TEMP_USER.heightCm).toFixed(2),
            unit: "km",
            icon: "location",
        },
        {
            label: "Calories",
            value: calcCalories(steps, TEMP_USER.weightKg).toFixed(1),
            unit: "kcal",
            icon: "flame",
        },
    ];
};
