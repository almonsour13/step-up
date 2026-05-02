import ActivityCard from "@/features/home/components/ui/ActivityCard";
import { ColView, RowView } from "@/shared/components/CustomView";
import ActivityDetailsDrawer, {
    ActivityDetailsDrawerHandle,
} from "@/shared/components/drawer/ActivityDetailsDrawer";
import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/drawer/ActivitySessionsDrawer";
import Card from "@/shared/components/ui/Card";
import { format, isToday, isYesterday } from "date-fns";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useActivityHistory } from "../hooks/use-activity-history";
import ActivityHistoryFilter from "./ActivityHistoryFilter";

function formatActivityDate(date: Date) {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
}

export default function ActivityHistoryList() {
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);
    const groupActivityHistory = useActivityHistory();
    const drawerRef = useRef<ActivityDetailsDrawerHandle>(null);

    const objectGroupActivityHistory = Object.entries(groupActivityHistory);
    const totalSessions = objectGroupActivityHistory.reduce(
        (acc, [, activities]) => acc + activities.length,
        0,
    );
    return (
        <>
            <ColView className="gap-4">
                <RowView className="px-4 hidden justify-between items-end">
                    <Text className="text-2xl font-medium">Activities</Text>
                    <Text className="text-base text-primary">
                        {totalSessions} session
                        {totalSessions > 1 ? "s" : ""}
                    </Text>
                </RowView>
                <ActivityHistoryFilter />
                <ColView className="px-4">
                    {objectGroupActivityHistory.map(([date, activities]) => {
                        const start = new Date(date);

                        return (
                            <ColView key={date} className="gap-2">
                                <TouchableOpacity
                                    onPress={() => {
                                        activitySessionsDrawerRef.current?.openWithActivities?.(
                                            date,
                                        );
                                    }}
                                >
                                    <RowView className=" justify-between items-center">
                                        <Text className="text-sm text-foreground">
                                            {formatActivityDate(start)}
                                            {", "}
                                            {format(start, "MMM d")}
                                        </Text>
                                        <Text className="text-sm text-primary">
                                            {activities.length} session
                                            {activities.length > 1 ? "s" : ""}
                                        </Text>
                                    </RowView>
                                </TouchableOpacity>
                                <Card className="p-0">
                                    <ColView className="gap-0">
                                        {activities.map((activity, i) => {
                                            return (
                                                <View key={activity.id}>
                                                    <ActivityCard
                                                        activity={activity}
                                                        showDay={false}
                                                        className="border-0"
                                                    />

                                                    {i <
                                                        activities.length -
                                                            1 && (
                                                        <View className="w-full border-b border-border/40" />
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </ColView>
                                </Card>
                            </ColView>
                        );
                    })}
                </ColView>
            </ColView>
            <ActivityDetailsDrawer ref={drawerRef} />
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </>
    );
}
