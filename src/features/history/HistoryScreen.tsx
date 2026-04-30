import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subDays } from "date-fns";
import { ScrollView, Text } from "react-native";
import ActivityHistoryList from "./components/ActivityHistoryList";

const activities = [
    {
        date: subDays(new Date(), 0),
        steps: 5400,
        goal: 7000,
        distance: 4.8,
        calories: 285,
        duration: 83,
    },
    {
        date: subDays(new Date(), 1),
        steps: 7800,
        goal: 7000,
        distance: 6.9,
        calories: 420,
        duration: 110,
    },
    {
        date: subDays(new Date(), 2),
        steps: 3200,
        goal: 7000,
        distance: 2.9,
        calories: 180,
        duration: 55,
    },
    {
        date: subDays(new Date(), 3),
        steps: 6200,
        goal: 7000,
        distance: 5.3,
        calories: 310,
        duration: 90,
    },
    {
        date: subDays(new Date(), 4),
        steps: 7100,
        goal: 7000,
        distance: 6.1,
        calories: 380,
        duration: 102,
    },
    {
        date: subDays(new Date(), 5),
        steps: 4100,
        goal: 7000,
        distance: 3.6,
        calories: 220,
        duration: 75,
    },
    {
        date: subDays(new Date(), 6),
        steps: 9200,
        goal: 7000,
        distance: 8.1,
        calories: 510,
        duration: 135,
    },
    {
        date: subDays(new Date(), 8),
        steps: 5900,
        goal: 7000,
        distance: 5.1,
        calories: 295,
        duration: 88,
    },
    {
        date: subDays(new Date(), 9),
        steps: 6700,
        goal: 7000,
        distance: 5.8,
        calories: 355,
        duration: 97,
    },
    {
        date: subDays(new Date(), 10),
        steps: 2800,
        goal: 7000,
        distance: 2.4,
        calories: 160,
        duration: 45,
    },
    {
        date: subDays(new Date(), 12),
        steps: 8400,
        goal: 7000,
        distance: 7.3,
        calories: 465,
        duration: 120,
    },
    {
        date: subDays(new Date(), 13),
        steps: 6000,
        goal: 7000,
        distance: 5.2,
        calories: 320,
        duration: 92,
    },
];

// Group by "This Week" / "Last Week" / month name
function groupByPeriod(items: typeof activities) {
    const now = new Date();
    const startOfThisWeek = subDays(
        now,
        now.getDay() === 0 ? 6 : now.getDay() - 1,
    );
    const startOfLastWeek = subDays(startOfThisWeek, 7);

    const groups: Record<string, typeof activities> = {};

    items.forEach((item) => {
        let label: string;
        if (item.date >= startOfThisWeek) label = "This week";
        else if (item.date >= startOfLastWeek) label = "Last week";
        else label = format(item.date, "MMMM yyyy");

        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
    });

    return groups;
}

const WEEKLY_STEPS = [5400, 7800, 3200, 6200, 7100, 4100, 9200];
const BAR_MAX = Math.max(...WEEKLY_STEPS);
const BAR_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HistoryScreen() {
    const groups = groupByPeriod(activities);

    const totalSteps = activities.reduce((s, a) => s + a.steps, 0);
    const avgSteps = Math.round(totalSteps / activities.length);
    const goalDays = activities.filter((a) => a.steps >= a.goal).length;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-5 pb-4">
                {/* Header */}
                <ColView className="px-4 pt-10 gap-0.5">
                    <Text className="text-2xl font-medium text-foreground">
                        History
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                        Last 30 days
                    </Text>
                </ColView>

                {/* Summary cards */}
                <RowView className="px-4 gap-2.5">
                    {[
                        {
                            label: "Avg steps",
                            value: avgSteps.toLocaleString(),
                            icon: "footsteps" as const,
                        },
                        {
                            label: "Goal days",
                            value: `${goalDays} / ${activities.length}`,
                            icon: "trophy" as const,
                        },
                        {
                            label: "Total km",
                            value: activities
                                .reduce((s, a) => s + a.distance, 0)
                                .toFixed(1),
                            icon: "location" as const,
                        },
                    ].map((s) => (
                        <Card key={s.label} className="flex-1 py-3 px-3 gap-2">
                            <Ionicons
                                name={s.icon}
                                size={16}
                                className="text-primary"
                            />
                            <Text className="text-lg font-medium text-foreground tracking-tight">
                                {s.value}
                            </Text>
                            <Text className="text-[11px] text-muted-foreground">
                                {s.label}
                            </Text>
                        </Card>
                    ))}
                </RowView>
                <ActivityHistoryList />
            </ColView>
        </ScrollView>
    );
}
