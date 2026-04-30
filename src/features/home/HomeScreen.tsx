import { ColView } from "@/shared/components/CustomView";
import { ScrollView } from "react-native";
import Header from "./components/layout/Header";
import RecentActivity from "./components/RecentActivity";
import ThisWeekActivityProgress from "./components/ThisWeekActivityProgress";
import TodayActivity from "./components/TodayActivity";

export default function HomeScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-4 pb-4">
                <Header />
                <ThisWeekActivityProgress />
                <TodayActivity />
                <RecentActivity />
            </ColView>
        </ScrollView>
    );
}
