import { ColView } from "@/shared/components/CustomView";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityController from "./components/ActivityController";
import ActivityProgress from "./components/ActivityProgress";
import ActivityStatistic from "./components/ActivityStatistic";
import ActivityHeader from "./components/layout/ActivityHeader";
export default function ActivityScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ColView className="gap-4 pb-4 flex-1 ">
                <ActivityHeader />
                <ColView className="flex-1 gap-1 px-4">
                    <ActivityProgress />
                    <ActivityStatistic />
                </ColView>
                <ActivityController />
            </ColView>
        </SafeAreaView>
    );
}
