import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecentActivities } from "../hooks/use-recent-activity";
import ActivityCard from "./ui/ActivityCard";

function RecentActivity() {
    const recentActivities = useRecentActivities(5);
    const router = useRouter();
    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between items-center">
                <Text className="text-base font-medium text-foreground">
                    Recent activity
                </Text>
                <TouchableOpacity onPress={() => router.push("/history")}>
                    <Text className="text-sm text-primary">See all</Text>
                </TouchableOpacity>
            </RowView>

            <ColView className="px-4 gap-1">
                {recentActivities.length === 0 ? (
                    <Card>
                        <RowView className="items-center gap-4">
                            <View className="flex-1 gap-1">
                                <Text className="text-[11px] text-muted-foreground">
                                    No activity yet
                                </Text>

                                <Text className="text-[22px] leading-none font-medium text-foreground">
                                    0 steps
                                </Text>

                                <Text className="text-[11px] text-muted-foreground">
                                    Start your first run to track progress
                                </Text>
                            </View>
                        </RowView>
                    </Card>
                ) : (
                    recentActivities.map((activity, i) => {
                        return (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                            />
                        );
                    })
                )}
            </ColView>
        </ColView>
    );
}
export default memo(RecentActivity);
