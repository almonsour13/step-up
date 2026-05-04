import { UserProfile } from "../stores/use-user.store";
import { Activity, StatItem } from "../types/type";
import { calcCalories, calcDistanceKm } from "../utils/activity.utils";

type StatKey = "steps" | "duration" | "distance" | "calories";

interface ActivityStatProps {
    activities: Activity[];
    profile: UserProfile | null;
    fields?: StatKey[];
}

export function getActivityStats({
    activities,
    profile,
    fields,
}: ActivityStatProps): StatItem[] {
    const stats: StatItem[] = [];

    // 👇 if no fields provided → return ALL
    const includeAll = !fields || fields.length === 0;

    // -------------------
    // STEPS
    // -------------------
    if (includeAll || fields.includes("steps")) {
        const totalSteps = activities.reduce((a, b) => a + b.steps, 0);

        stats.push({
            label: "Steps",
            value: totalSteps.toLocaleString(),
            unit: null,
            icon: "walk-outline",
        });
    }

    // -------------------
    // DURATION
    // -------------------
    if (includeAll || fields.includes("duration")) {
        const totalDuration = activities.reduce(
            (sum, a) => sum + a.duration,
            0,
        );

        const totalSeconds = Math.floor(totalDuration / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);

        stats.push({
            label: "Duration",
            value: `${hours}h ${mins}m`,
            unit: null,
            icon: "time-outline",
        });
    }

    // -------------------
    // DISTANCE
    // -------------------
    if (includeAll || fields.includes("distance")) {
        const totalDistance = activities.reduce(
            (a, b) => a + calcDistanceKm(b.steps, profile?.height || 165),
            0,
        );

        stats.push({
            label: "Distance",
            value: totalDistance.toFixed(2),
            unit: "km",
            icon: "location-outline",
        });
    }

    // -------------------
    // CALORIES
    // -------------------
    if (includeAll || fields.includes("calories")) {
        const totalCalories = activities.reduce(
            (a, b) => a + calcCalories(b.steps, profile?.weight || 65),
            0,
        );

        stats.push({
            label: "Calories",
            value: totalCalories.toFixed(2),
            unit: "kcal",
            icon: "flame-outline",
        });
    }

    return stats;
}
