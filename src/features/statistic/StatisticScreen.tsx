import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { ScrollView, Text } from "react-native";
import Header from "./components/layout/Header";

export default function StatisticScreen() {
    return (
        <ScrollView>
            <ColView className="flex-1 gap-8">
                <Header />
                <ColView className="px-4">
                    <Card className="h-48" />
                </ColView>
                <ColView className="px-4">
                    <RowView className="justify-between items-center">
                        <Text className="text-base font-medium text-foreground">
                            Today's activity
                        </Text>
                    </RowView>
                    <Card className="h-48" />
                </ColView>
            </ColView>
        </ScrollView>
    );
}
