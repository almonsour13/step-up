import { ColView } from "@/shared/components/CustomView";
import { ScrollView } from "react-native";
import Header from "./components/layout/Header";
import RecentActivity from "./components/RecentActivity";
import TodayActivity from "./components/TodayActivity";
import WeekActivity from "./components/WeekActivity";

export default function HomeScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-4 pb-4">
                <Header />
                <WeekActivity />
                <TodayActivity />
                <RecentActivity />
            </ColView>
        </ScrollView>
    );
}
