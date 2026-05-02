import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useFilterStore } from "../stores/use-filter.store";

const SORT_OPTIONS = [
    {
        label: "Newest to Old",
        value: "newest",
    },
    {
        label: "Oldest to Newest",
        value: "oldest",
    },
] as const;
const PERIOD_FILTERS = [
    { label: "All time", value: "all" },
    { label: "This week", value: "week" },
    { label: "This month", value: "month" },
] as const;

export default function ActivityHistoryFilter() {
    const sortDrawerRef = useRef<DrawerHandle>(null);
    const sort = useFilterStore((s) => s.sort);
    const setSort = useFilterStore((s) => s.setSort);
    const period = useFilterStore((s) => s.period);
    const setPeriod = useFilterStore((s) => s.setPeriod);

    return (
        <>
            <RowView className="justify-between items-center px-4 gap-1">
                {PERIOD_FILTERS.map((p) => (
                    <TouchableOpacity
                        key={p.label}
                        className={cn(
                            "px-4 py-2 items-center bg-card rounded-full",
                            p.value === period && "bg-primary",
                        )}
                        onPress={() => setPeriod(p.value)}
                    >
                        <Text
                            className={cn(
                                "text-sm",
                                p.value === period && "text-white",
                            )}
                        >
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={() => sortDrawerRef.current?.open()}
                    className="px-4 py-2 bg-card items-center rounded-lg"
                >
                    <Text className="text-sm">{capitalize(sort)}</Text>
                </TouchableOpacity>
            </RowView>

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
        </>
    );
}
