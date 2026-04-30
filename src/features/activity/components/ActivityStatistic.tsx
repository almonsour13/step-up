import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";
import { useActivityStatistic } from "../hooks/use-activity-statistic";

export default function ActivityStatistic() {
    const stats = useActivityStatistic();

    return (
        <RowView className="justify-between gap-2">
            {stats.map((stat) => (
                <Card key={stat.label} className="flex-1">
                    <ColView className="gap-1 items-start">
                        <Ionicons
                            name={stat.icon}
                            size={24}
                            className="text-primary"
                        />
                        <RowView className="items-end gap-1">
                            <Text className="text-3xl text-foreground font-semibold">
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
            ))}
        </RowView>
    );
}
