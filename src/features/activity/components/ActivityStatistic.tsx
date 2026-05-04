import { RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import {
    calcCalories,
    calcDistanceKm,
    formatDurationClock,
} from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
export default function ActivityStatistic() {
    const profile = useProfileStore((s) => s.profile);
    const activeActivity = useActiveActivityStore((s) => s.activeActivity);
    const stats = [
        {
            label: "Duration",
            value: formatDurationClock(activeActivity.duration),
            icon: "time" as const,
        },
        {
            label: "Distance",
            value: calcDistanceKm(
                activeActivity.steps,
                profile?.height || 170,
            ).toFixed(2),
            unit: "km",
            icon: "location" as const,
        },
        {
            label: "Calories",
            value: calcCalories(
                activeActivity.steps,
                profile?.weight || 65,
            ).toFixed(1),
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
