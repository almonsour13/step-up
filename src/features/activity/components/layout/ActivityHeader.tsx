import { RowView } from "@/shared/components/CustomView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";

export default function ActivityHeader() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <RowView className="px-4 h-20 items-center justify-between">
            <Ionicons name="arrow-back" size={28} />
            <RowView className="flex-1 justify-center">
                <Text className="font-medium">{date}</Text>
            </RowView>
            <Ionicons className="opacity-0" name="arrow-back" size={28} />
        </RowView>
    );
}
