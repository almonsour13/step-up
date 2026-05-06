import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { useNavigation } from "@react-navigation/native";
import { memo, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ActivityCard from "../../../shared/components/ActivityCard";

function RecentActivity() {
    const navigation = useNavigation();
    const isLoading = useActivityStore((s) => s.isLoading);
    const activities = useMemo(() => {
        return useActivityStore((s) => s.activities).slice(0, 5);
    }, []);
    return (
        <ColView className="gap-2">
            <RowView className="px-4 justify-between items-end">
                <Text className="text-lg font-medium text-foreground">
                    Recent activity
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("history" as never)}
                >
                    <Text className="text-base text-primary">See all</Text>
                </TouchableOpacity>
            </RowView>

            <ColView className="px-4">
                {isLoading ? (
                    <Card className="flex-col p-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <View key={i}>
                                <View className="h-20" />
                                {i < 4 && ( // ← hardcoded since skeleton is always 5 items
                                    <View className="w-full border-b border-border/40" />
                                )}
                            </View>
                        ))}
                    </Card>
                ) : activities.length === 0 ? (
                    <Card>
                        <RowView className="items-center gap-4">
                            <View className="flex-1 gap-1">
                                <Text className="text-base text-foreground">
                                    No activity yet
                                </Text>

                                <Text className="text-xs text-muted-foreground">
                                    Consistency beats intensity. Start your
                                    first session today.
                                </Text>
                            </View>
                        </RowView>
                    </Card>
                ) : (
                    <Card className="p-0">
                        {activities.map((activity, i) => {
                            return (
                                <View key={activity.id}>
                                    <ActivityCard activity={activity} />
                                    {i < activities.length - 1 && (
                                        <View className="w-full border-b border-border/40" />
                                    )}
                                </View>
                            );
                        })}
                    </Card>
                )}
            </ColView>
        </ColView>
    );
}
export default memo(RecentActivity);
