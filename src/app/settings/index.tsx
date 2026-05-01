import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const THEME_OPTIONS = ["System", "Light", "Dark"] as const;
const UNIT_OPTIONS = ["km", "miles"] as const;
const STEP_GOAL_OPTIONS = [5000, 7500, 10000, 12500, 15000] as const;

type Theme = (typeof THEME_OPTIONS)[number];
type Unit = (typeof UNIT_OPTIONS)[number];

export default function SettingsScreen() {
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

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="gap-4 pb-8">
                {/* Header */}
                <ColView className="px-4 mt-4 h-16 justify-center">
                    <RowView className="items-center justify-between">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                className="text-foreground"
                            />
                        </TouchableOpacity>
                        <Text className="text-base font-medium text-foreground">
                            Settings
                        </Text>
                        <View className="w-6" />
                    </RowView>
                </ColView>

                {/* Profile Card */}
                <ColView className="px-4">
                    <TouchableOpacity onPress={() => router.push("/profile")}>
                        <Card className="p-0 overflow-hidden">
                            <RowView className="justify-between items-center px-4 h-20 gap-4">
                                <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
                                    <Text className="text-sm font-medium text-background">
                                        MO
                                    </Text>
                                </View>
                                <ColView className="flex-1 gap-0.5">
                                    <Text className="text-base font-medium text-foreground">
                                        Monsour
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">
                                        23 · 165 cm · 65 kg · Male
                                    </Text>
                                </ColView>
                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    className="text-muted-foreground"
                                />
                            </RowView>
                        </Card>
                    </TouchableOpacity>
                </ColView>

                {/* Sections */}
                {sections.map((section) => (
                    <ColView key={section.title} className="px-4 gap-1.5">
                        <Text className="text-sm text-muted-foreground px-1">
                            {section.title}
                        </Text>
                        <Card className="p-0 overflow-hidden">
                            {section.items.map((item, i) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={
                                        item.type !== "toggle"
                                            ? item.onPress
                                            : undefined
                                    }
                                    activeOpacity={
                                        item.type === "toggle" ? 1 : 0.6
                                    }
                                >
                                    <RowView
                                        className={cn(
                                            "justify-between items-center px-4 h-[68px]",
                                            i < section.items.length - 1
                                                ? "border-b border-border"
                                                : "",
                                        )}
                                    >
                                        <RowView className="gap-4 items-center flex-1">
                                            <View
                                                className={cn(
                                                    "w-10 h-10 rounded-full items-center justify-center",
                                                    item.type === "danger"
                                                        ? "bg-red-500/10"
                                                        : "bg-muted",
                                                )}
                                            >
                                                <Ionicons
                                                    name={item.icon}
                                                    size={18}
                                                    color={
                                                        item.type === "danger"
                                                            ? "#ef4444"
                                                            : undefined
                                                    }
                                                    className={
                                                        item.type !== "danger"
                                                            ? "text-foreground"
                                                            : ""
                                                    }
                                                />
                                            </View>
                                            <ColView className="gap-0 flex-1">
                                                <Text
                                                    className={cn(
                                                        "text-sm font-normal",
                                                        item.type === "danger"
                                                            ? "text-red-500"
                                                            : "text-foreground",
                                                    )}
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.description && (
                                                    <Text className="text-[11px] text-muted-foreground">
                                                        {item.description}
                                                    </Text>
                                                )}
                                            </ColView>
                                        </RowView>

                                        {item.type === "toggle" ? (
                                            <Switch
                                                value={item.value as boolean}
                                                onValueChange={item.onPress}
                                                trackColor={{ true: "#639922" }}
                                            />
                                        ) : item.type === "cycle" ? (
                                            <RowView className="items-center gap-1">
                                                <Text className="text-sm text-muted-foreground">
                                                    {item.value}
                                                </Text>
                                                <MaterialIcons
                                                    name="chevron-right"
                                                    size={18}
                                                    className="text-muted-foreground"
                                                />
                                            </RowView>
                                        ) : null}
                                    </RowView>
                                </TouchableOpacity>
                            ))}
                        </Card>
                    </ColView>
                ))}

                {/* App version */}
                <Text className="text-center text-xs text-muted-foreground mt-2">
                    Version 1.0.0
                </Text>
            </ColView>
        </ScrollView>
    );
}
