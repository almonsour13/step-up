import { ColView, RowView } from "@/shared/components/CustomView";
import ActivityDetailsDrawer, {
    ActivityDetailsDrawerHandle,
} from "@/shared/components/drawer/ActivityDetailsDrawer";
import ActivitySessionsDrawer, {
    ActivitySessionsDrawerHandle,
} from "@/shared/components/drawer/ActivitySessionsDrawer";
import Card from "@/shared/components/ui/Card";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { SORT_OPTIONS } from "@/shared/constants/constant";
import { useActivity } from "@/shared/hooks/use-activity";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { Activity } from "@/shared/types/type";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import { formatActivityDate } from "@/shared/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    View,
} from "react-native";
import ActivityCard from "../../shared/components/ActivityCard";
import ActivityHistoryFilter from "./components/ActivityHistoryFilter";
import ActivityHistorySummary from "./components/ActivityHistorySummary";
import Header from "./components/layout/Header";
import { useHistoryFilterStore } from "./stores/use-history-filter.store";

export type GroupActivity = Record<string, Activity[]>;

export default function HistoryScreen() {
    const sortDrawerRef = useRef<DrawerHandle>(null);
    const activitySessionsDrawerRef =
        useRef<ActivitySessionsDrawerHandle>(null);
    const activityDetailsDrawerRef = useRef<ActivityDetailsDrawerHandle>(null);

    const isLoading = useActivityStore((s) => s.isLoading);
    const { sort, period, dayLimit, page } = useHistoryFilterStore(
        (s) => s.filters,
    );
    const setSort = useHistoryFilterStore((s) => s.setSort);
    const setPage = useHistoryFilterStore((s) => s.setPage);

    const isRefreshing = useActivityStore((s) => s.isRefreshing);
    const activities = useActivityStore((s) => s.activities);

    const { handleRefresh } = useActivity();
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { groupedActivities: activityHistory, hasMore } = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const filtered = activities.filter((a) => {
            const createdAt = new Date(a.createdAt);

            if (period === "week") {
                const start = new Date(today);
                start.setDate(today.getDate() - 7);
                return createdAt >= start && createdAt <= today;
            }

            if (period === "month") {
                const start = new Date(today);
                start.setMonth(today.getMonth() - 1);
                return createdAt >= start && createdAt <= today;
            }

            if (period === "year") {
                const start = new Date(today);
                start.setFullYear(today.getFullYear() - 1);

                return createdAt >= start;
            }

            if (period === "all" && dayLimit && page) {
                // Show everything from now back to page * dayLimit
                const start = new Date(today);
                start.setDate(today.getDate() - dayLimit * page);
                return createdAt >= start && createdAt <= today;
            }

            return true;
        });

        const groupedActivities: GroupActivity = filtered.reduce(
            (acc, activity) => {
                const key = format(new Date(activity.startTime), "yyyy-MM-dd");
                if (!acc[key]) acc[key] = [];
                acc[key].push(activity);
                return acc;
            },
            {} as GroupActivity,
        );

        const groupedEntries = Object.entries(groupedActivities);

        const cutoff = new Date(today);
        cutoff.setDate(today.getDate() - (dayLimit ?? 0) * (page ?? 1));

        const hasMore =
            period === "all" &&
            !!dayLimit &&
            !!page &&
            groupedEntries.length > 0 &&
            activities.some((a) => new Date(a.createdAt) < cutoff);

        return {
            hasMore,
            groupedActivities: groupedEntries,
        };
    }, [activities, period, dayLimit, page]);

    const handleLoadMore = useCallback(() => {
        if (!hasMore) return;
        if (isLoadingMore) return;
        if (isLoading) return;

        setIsLoadingMore(true);
        setPage((page ?? 1) + 1);
    }, [hasMore, isLoading, isLoadingMore, page, setPage]);

    // in useEffect
    useEffect(() => {
        setIsLoadingMore(false);
    }, [activityHistory]);

    const RenderHeader = useCallback(() => {
        return (
            <ColView>
                <Header />
                <ActivityHistoryFilter />
                <ActivityHistorySummary />
                <RowView className="pt-2 px-4 justify-between items-end">
                    <RowView className="items-end gap-2">
                        <Text className="text-lg font-medium">Sessions</Text>
                    </RowView>
                    <TouchableOpacity
                        onPress={() => sortDrawerRef.current?.open()}
                        className="items-center rounded-lg"
                    >
                        <Text className="hidden text-sm text-muted-foreground">
                            {capitalize(sort || "newest")}
                        </Text>
                    </TouchableOpacity>
                </RowView>
            </ColView>
        );
    }, [sort]);

    return (
        <>
            <FlatList
                key="history-list"
                data={
                    isLoading && activityHistory.length === 0
                        ? []
                        : activityHistory
                }
                contentContainerClassName="gap-2 pb-28"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={RenderHeader}
                keyExtractor={([date]) => date}
                onEndReached={() => handleLoadMore()}
                onEndReachedThreshold={0.5}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
                windowSize={10}
                disableIntervalMomentum={true}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    isLoading ? (
                        <RowView className="justify-center py-8">
                            <ActivityIndicator size="large" />
                        </RowView>
                    ) : (
                        <RowView className="justify-center py-8">
                            <Text className="text-muted-foreground">
                                No activity history
                            </Text>
                        </RowView>
                    )
                }
                ListFooterComponent={
                    <RowView
                        className="justify-center py-4"
                        style={{ minHeight: 52 }}
                    >
                        {hasMore && <ActivityIndicator size="small" />}
                    </RowView>
                }
                renderItem={({ item }) => {
                    const [date, activities] = item;
                    const start = new Date(date);

                    return (
                        <ColView key={date} className="gap-2 px-4">
                            <TouchableOpacity
                                onPress={() => {
                                    activitySessionsDrawerRef.current?.openWithActivities?.(
                                        date,
                                    );
                                }}
                            >
                                <RowView className="justify-between items-center">
                                    <Text className="text-sm text-muted-foreground">
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
                                    {activities.map((activity, i) => (
                                        <View key={activity.id}>
                                            <ActivityCard
                                                activity={activity}
                                                showDay={false}
                                                className="border-0"
                                            />
                                            {i < activities.length - 1 && (
                                                <View className="w-full border-b border-border/40" />
                                            )}
                                        </View>
                                    ))}
                                </ColView>
                            </Card>
                        </ColView>
                    );
                }}
            />
            <Drawer ref={sortDrawerRef}>
                <ColView className="pb-4">
                    {SORT_OPTIONS.map((s) => {
                        const isActive = s.value === sort;
                        return (
                            <TouchableOpacity
                                key={s.label}
                                onPress={() => {
                                    setSort(s.value);
                                    sortDrawerRef.current?.close();
                                }}
                                className={cn(
                                    "p-4 px-8 h-16 justify-center",
                                    isActive && "bg-muted",
                                )}
                            >
                                <RowView className="justify-between">
                                    <Text
                                        className={cn(
                                            "text-lg",
                                            isActive && "text-primary",
                                        )}
                                    >
                                        {s.label}
                                    </Text>
                                    {isActive && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            className="text-primary"
                                        />
                                    )}
                                </RowView>
                            </TouchableOpacity>
                        );
                    })}
                </ColView>
            </Drawer>
            <ActivityDetailsDrawer ref={activityDetailsDrawerRef} />
            <ActivitySessionsDrawer ref={activitySessionsDrawerRef} />
        </>
    );
}
