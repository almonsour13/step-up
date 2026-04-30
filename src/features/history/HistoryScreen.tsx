import { ColView } from "@/shared/components/CustomView";
import { ScrollView, Text } from "react-native";
import ActivityHistoryList from "./components/ActivityHistoryList";

export default function HistoryScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-5 pb-4">
                {/* Header */}
                <ColView className="px-4 pt-10 gap-0.5">
                    <Text className="text-2xl font-medium text-foreground">
                        History
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                        Last 30 days
                    </Text>
                </ColView>
                <ActivityHistoryList />
            </ColView>
        </ScrollView>
    );
}
