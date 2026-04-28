import { ColView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { Text, View } from "react-native";

export default function ActivityProgress() {
    const goal = 5000;
    const current = 3400;
    const progress = (current / goal) * 100;
    return (
        <Card className="aspect-square justify-center items-center">
            <View className="flex-1 aspect-square rounded-full border-32 border-primary justify-center items-center p-2">
                <View className="flex-1 aspect-square rounded-full bg-primary justify-center items-center p-2">
                    <ColView className="items-center">
                        <Text className="text-sm text-white">Goal: {goal}</Text>
                        <Text className="text-6xl text-white font-medium">
                            {current}
                        </Text>
                        <Text className="text-sm text-white">Steps</Text>
                    </ColView>
                </View>
            </View>
        </Card>
    );
}
