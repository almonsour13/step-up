import { RowView } from "@/shared/components/CustomView";
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
        <RowView className="px-4 pt-8 items-center justify-between">
            <RowView className="flex-1 justify-center">
                <Text className="text-xl font-medium">{date}</Text>
            </RowView>
        </RowView>
    );
}
