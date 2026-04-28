import { ColView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { Text, View } from "react-native";

export default function ActivityProgress() {
    const goal = 5000;
    const current = 3400;
    const progress = (current / goal) * 100;
    return (
        <Card className="aspect-square justify-center items-center rounded-md">
            <View className="flex-1 aspect-square rounded-full border-32 border-card-foreground justify-center items-center p-4">
                <View className="flex-1 aspect-square rounded-full bg-card-foreground justify-center items-center p-2">
                    <ColView className="items-center">
                        <Text className="text-sm">Goal: {goal}</Text>
                        <Text className="text-6xl">{current}</Text>
                        <Text className="text-sm">Steps</Text>
                    </ColView>
                </View>
            </View>
        </Card>
    );
}
