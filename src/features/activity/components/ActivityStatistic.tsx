import { RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import {
    calcCalories,
    calcDistanceKm,
    formatDuration,
} from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";
const TEMP_USER = {
    weightKg: 65,
    heightCm: 165,
};

export default function ActivityStatistic() {
    const duration = useActivityStore((s) => s.duration);
    const steps = useActivityStore((s) => s.steps);
    const stats = [
        {
            label: "Duration",
            value: formatDuration(duration),
            icon: "time" as const,
        },
        {
            label: "Distance",
            value: calcDistanceKm(steps, TEMP_USER.heightCm).toFixed(2),
            unit: "km",
            icon: "location" as const,
        },
        {
            label: "Calories",
            value: calcCalories(steps, TEMP_USER.weightKg).toFixed(1),
            unit: "kcal",
            icon: "flame" as const,
        },
    ];

    return (
        <RowView className="gap-1">
            {stats.map((stat) => (
                <Card key={stat.label} className="flex-1 gap-1">
                    <RowView className="gap-1">
                        <Ionicons
                            name={stat.icon}
                            size={12}
                            className="text-primary"
                        />
                        <Text className="text-xs text-muted-foreground">
                            {stat.label}
                        </Text>
                    </RowView>
                    <RowView className="items-baseline gap-1">
                        <Text className="text-2xl leading-none font-medium text-foreground">
                            {stat.value}
                        </Text>
                        {stat.unit && (
                            <Text className="text-[10px] text-muted-foreground">
                                {stat.unit}
                            </Text>
                        )}
                    </RowView>
                </Card>
            ))}
        </RowView>
    );
}
