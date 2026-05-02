import { ColView } from "@/shared/components/CustomView";
import { Text, TouchableOpacity, View } from "react-native";

export default function Screen() {
    return (
        <View className="flex-1">
            <ColView>
                <View className="flex-1" />
                <View className="px-4">
                    <TouchableOpacity className="h-16 rounded-full justify-center items-center bg-primary ">
                        <Text className="text-white font-medium">
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </ColView>
        </View>
    );
}
