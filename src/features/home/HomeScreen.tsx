import { ColView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { Dimensions, ScrollView, Text, View } from "react-native";
import RecentActivity from "./components/RecentActivity";
import TodayActivity from "./components/TodayActivity";

const { width } = Dimensions.get("window");
export default function HomeScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ColView className="flex-1 gap-4 pb-4">
                <View className="px-4 pt-8">
                    <Text className="text-2xl text-foreground font-medium">
                        Home
                    </Text>
                </View>
                {/* add content here */}
                <View className="px-4">
                    <Card className="h-48" />
                </View>
                <TodayActivity />
                <RecentActivity />
            </ColView>
        </ScrollView>
    );
}
