import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { formatDuration } from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";

export default function ActivityStatistic() {
    const { status, duration } = useActivityStore();
    const stats = [
        {
            label: "Duration",
            value: formatDuration(duration),
            icon: "time" as const,
        },
        {
            label: "Distance",
            value: "4.8",
            unit: "km",
            icon: "location" as const,
        },
        {
            label: "Calories",
            value: "285",
            unit: "kcal",
            icon: "flame" as const,
        },
    ];
    return (
        <RowView className="justify-between gap-2">
            {stats.map((stat) => {
                return (
                    <Card key={stat.label} className="flex-1 ">
                        <ColView className="gap-1 justify-start items-start">
                            {/* Top: Icon + Label */}
                            <Ionicons
                                name={stat.icon}
                                size={24}
                                className="text-primary"
                            />
                            {/* Bottom: Value + Unit */}
                            <RowView className="items-end gap-1">
                                <Text className="text-3xl font-semibold">
                                    {stat.value}
                                </Text>
                                {stat.unit && (
                                    <Text className="text-xs text-muted-foreground pb-1">
                                        {stat.unit}
                                    </Text>
                                )}
                            </RowView>
                            <Text className="text-xs font-light text-muted-foreground">
                                {stat.label}
                            </Text>
                        </ColView>
                    </Card>
                );
            })}
        </RowView>
    );
}
