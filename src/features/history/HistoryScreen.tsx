import { ColView } from "@/shared/components/CustomView";
import { ScrollView, Text } from "react-native";
import ActivityHistoryFilter from "./components/ActivityHistoryFilter";
import ActivityHistoryList from "./components/ActivityHistoryList";
import ActivityHistorySummary from "./components/ActivityHistorySummary";

const PERIOD_FILTERS = [
    { label: "All Time", value: "all" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
    { label: "Last 7 days", value: "7days" },
] as const;

export default function HistoryScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-8 pb-4">
                {/* Header */}
                <ColView className="px-4 pt-10 gap-0.5">
                    <Text className="text-2xl font-medium text-foreground">
                        History
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                        Your activity over time
                    </Text>
                </ColView>

                <ActivityHistorySummary />
                <ColView>
                    <ActivityHistoryFilter />
                    <ActivityHistoryList />
                </ColView>
                <ColView className="justify-center items-center p-4">
                    <Text className="text-muted-foreground">You caught up</Text>
                </ColView>
            </ColView>
        </ScrollView>
    );
}
