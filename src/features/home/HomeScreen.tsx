import { ColView } from "@/shared/components/CustomView";
import { useActivity } from "@/shared/hooks/use-activity";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { RefreshControl, ScrollView } from "react-native";
import HomeHeader from "./components/layout/HomeHeader";
import RecentActivity from "./components/RecentActivity";
import TodayActivity from "./components/TodayActivity";
import WeekActivity from "./components/WeekActivity";

export default function HomeScreen() {
    const isRefreshing = useActivityStore((s) => s.isRefreshing);
    const { handleRefresh } = useActivity();
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <ColView className="flex-1 gap-4 pb-4">
                <HomeHeader />
                <WeekActivity />
                <TodayActivity />
                <RecentActivity />
            </ColView>
        </ScrollView>
    );
}
