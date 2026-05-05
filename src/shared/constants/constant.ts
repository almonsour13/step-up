const APP_PREFIX = "@steps";

export const STORAGE_KEYS = {
    ONBOARDING: `${APP_PREFIX}/onboarding`,
    PROFILE: `${APP_PREFIX}/profile`,
    SETTINGS: `${APP_PREFIX}/settings`,
    ACTIVITIES: `${APP_PREFIX}/activities`,
    ACTIVE_ACTIVITY: `${APP_PREFIX}/active-activity`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const GENDER_OPTIONS = ["Male", "Female"] as const;
export const THEME_OPTIONS = ["System", "Light", "Dark"] as const;
export const UNIT_OPTIONS = ["km", "miles"] as const;
export const STEP_GOAL_OPTIONS = [
    2000, 3000, 5000, 7500, 10000, 12500, 15000, 20000,
];

export const SORT_OPTIONS = [
    {
        label: "Newest to Old",
        value: "newest",
    },
    {
        label: "Oldest to Newest",
        value: "oldest",
    },
] as const;
