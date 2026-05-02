import SettingsScreen from "@/features/settings/SettingsScreen";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert
} from "react-native";

const THEME_OPTIONS = ["System", "Light", "Dark"] as const;
const UNIT_OPTIONS = ["km", "miles"] as const;
const STEP_GOAL_OPTIONS = [5000, 7500, 10000, 12500, 15000] as const;

type Theme = (typeof THEME_OPTIONS)[number];
type Unit = (typeof UNIT_OPTIONS)[number];

export default function index() {
    const router = useRouter();

    const [theme, setTheme] = useState<Theme>("System");
    const [stepGoal, setStepGoal] = useState(10000);
    const [units, setUnits] = useState<Unit>("km");
    const [autoPause, setAutoPause] = useState(true);
    const [notifications, setNotifs] = useState(true);

    const cycleTheme = () => {
        const i = THEME_OPTIONS.indexOf(theme);
        setTheme(THEME_OPTIONS[(i + 1) % THEME_OPTIONS.length]);
    };

    const cycleUnits = () => {
        const i = UNIT_OPTIONS.indexOf(units);
        setUnits(UNIT_OPTIONS[(i + 1) % UNIT_OPTIONS.length]);
    };

    const cycleStepGoal = () => {
        const i = STEP_GOAL_OPTIONS.indexOf(stepGoal as any);
        setStepGoal(STEP_GOAL_OPTIONS[(i + 1) % STEP_GOAL_OPTIONS.length]);
    };

    const confirmClearData = () =>
        Alert.alert(
            "Clear Activity Data",
            "This will permanently delete all your activity history. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: () => {} },
            ],
        );

    const sections = [
        {
            title: "Preferences",
            items: [
                {
                    label: "Theme",
                    description: "Follow system or choose manually",
                    icon: "color-palette" as const,
                    value: theme,
                    onPress: cycleTheme,
                    type: "cycle",
                },
                {
                    label: "Units",
                    description: "Distance measurement",
                    icon: "swap-horizontal" as const,
                    value: units,
                    onPress: cycleUnits,
                    type: "cycle",
                },
                {
                    label: "Step Goal",
                    description: "Daily step target",
                    icon: "flag-outline" as const,
                    value: stepGoal.toLocaleString(),
                    onPress: cycleStepGoal,
                    type: "cycle",
                },
            ],
        },
        {
            title: "Activity",
            items: [
                {
                    label: "Auto-Pause",
                    description: "Pause when you stop moving",
                    icon: "pause-circle-outline" as const,
                    value: autoPause,
                    onPress: () => setAutoPause((v) => !v),
                    type: "toggle",
                },
                {
                    label: "Notifications",
                    description: "Goal reminders and alerts",
                    icon: "notifications-outline" as const,
                    value: notifications,
                    onPress: () => setNotifs((v) => !v),
                    type: "toggle",
                },
            ],
        },
        {
            title: "Data",
            items: [
                {
                    label: "Clear Activity Data",
                    description: "Delete all recorded sessions",
                    icon: "trash-outline" as const,
                    value: undefined,
                    onPress: confirmClearData,
                    type: "danger",
                },
            ],
        },
    ];
    return <SettingsScreen />;
}
