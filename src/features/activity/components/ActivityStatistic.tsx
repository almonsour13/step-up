import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";

export default function ActivityStatistic() {
    const stats: {
        label: string;
        value: string;
        unit?: string;
        icon: keyof typeof Ionicons.glyphMap;
    }[] = [
        { label: "Duration", value: "01:23", icon: "time" },
        { label: "Distance", value: "4.8", unit: "km", icon: "location" },
        { label: "Calories", value: "285", unit: "kcal", icon: "flame" },
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
