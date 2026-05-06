import { RowView } from "@/shared/components/CustomView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActivityHeader() {
    const navigation = useNavigation();
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <RowView className="p-4 pt-8 items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    className="text-foreground"
                />
            </TouchableOpacity>
            <RowView className="flex-1 justify-center">
                <Text className="text-xl font-medium">{date}</Text>
            </RowView>
            <View className="w-8 h-8 " />
        </RowView>
    );
}
