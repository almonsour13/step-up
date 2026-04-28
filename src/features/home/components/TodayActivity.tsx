import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");
export default function TodayActivity() {
    const goal = 7000;
    const steps = 5400;
    const progress = (steps / goal) * 100;
    const stats = [
        { label: "Duration", value: "01:23", icon: "time" as const },
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
        <ColView className="gap-2">
            <RowView className="px-4 justify-between">
                <Text className="text-base text-foreground">
                    Today Activity
                </Text>
            </RowView>
            <ColView className="px-4">
                <Card className="w-full">
                    <RowView className="justify-between">
                        <ColView className="flex-1">
                            <Text className="text-4xl text-foreground font-medium">
                                {steps}{" "}
                                <Text className="text-sm text-muted-foreground">
                                    / {goal} steps
                                </Text>
                            </Text>

                            <RowView className="gap-4">
                                {stats.map((stat) => {
                                    return (
                                        <ColView
                                            key={stat.label}
                                            className="justify-center items-start gap-0"
                                        >
                                            <RowView className="items-end gap-1">
                                                <Text className="text-xl text-foreground font-semibold">
                                                    {stat.value}
                                                </Text>
                                                {stat.unit && (
                                                    <Text className="text-xs text-muted-foreground pb-1">
                                                        {stat.unit}
                                                    </Text>
                                                )}
                                            </RowView>
                                            <RowView className="gap-1 items-center">
                                                <Ionicons
                                                    name={stat.icon}
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                <Text className="text-xs font-normal text-muted-foreground">
                                                    {stat.label}
                                                </Text>
                                            </RowView>
                                        </ColView>
                                    );
                                })}
                            </RowView>
                        </ColView>
                        <View className="h-24 rounded-full aspect-square border-12 border-primary">
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-2xl font-medium">
                                    {progress.toFixed(0)}
                                    <Text className="text-sm">%</Text>
                                </Text>
                            </View>
                        </View>
                    </RowView>
                </Card>
            </ColView>
        </ColView>
    );
}
