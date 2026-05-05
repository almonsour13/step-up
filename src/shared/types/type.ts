export type ActivityStatus = "idle" | "active" | "paused";

export type Gender = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export type Unit = "km" | "miles";

export type Theme = "system" | "light" | "dark";

export type Activity = {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    steps: number;
    goal: number;
    createdAt: string;
    updatedAt?: string;
};

export type Profile = {
    id?: string;
    name: string;
    height: number; // cm
    weight: number; // kg
    age: number; // years
    gender: Gender | null;
    createdAt?: string; // ISO 8601
    updatedAt?: string;
};

export type Settings = {
    theme: Theme;
    units: Unit;
    stepGoal: number;
    autoPause: boolean;
    notifications: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    units: "km",
    stepGoal: 10000,
    autoPause: true,
    notifications: true,
};

export const DEFAULT_PROFILE: Omit<Profile, "id" | "createdAt" | "updatedAt"> =
    {
        name: "",
        height: 165,
        weight: 65,
        age: 20,
        gender: "male",
    };

export type PeriodType = "all" | "day" | "week" | "month" | "year";
export type ActivityFilters = {
    sort?: "newest" | "oldest";
    period?: PeriodType;
    page?: number;
    limit?: number;
    dayLimit?: number;
};
export type StatItem = {
    label: string;
    value: string;
    unit: string | null;
    icon:
        | "walk-outline"
        | "time-outline"
        | "location-outline"
        | "flame-outline";
};
