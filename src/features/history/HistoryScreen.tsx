import { ColView } from "@/shared/components/CustomView";
import { ScrollView, Text } from "react-native";
import ActivityHistoryList from "./components/ActivityHistoryList";
import ActivityHistorySummary from "./components/ActivityHistorySummary";
import Header from "./components/layout/Header";

const PERIOD_FILTERS = [
    { label: "All Time", value: "all" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
    { label: "Last 7 days", value: "7days" },
] as const;

export default function HistoryScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-4 pb-4">
                <Header />
                <ActivityHistorySummary />
                <ActivityHistoryList />
                <ColView className="justify-center items-center p-4">
                    <Text className="text-sm text-muted-foreground">
                        You caught up
                    </Text>
                </ColView>
            </ColView>
        </ScrollView>
    );
}
