import { RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { cn } from "@/shared/utils/cn";
import { TouchableOpacity } from "react-native";
import { useHistoryFilterStore } from "../stores/use-history-filter.store";

const PERIOD_FILTERS = [
    { label: "All Time", value: "all" },
    // { label: "Today", value: "day" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
] as const;

export default function ActivityHistoryFilter() {
    const period = useHistoryFilterStore((s) => s.filters.period);
    const setPeriod = useHistoryFilterStore((s) => s.setPeriod);
    return (
        <>
            <RowView className="justify-between items-center px-4 gap-1">
                <RowView className="gap-1">
                    {PERIOD_FILTERS.map((p) => (
                        <TouchableOpacity
                            key={p.label}
                            onPress={() => setPeriod(p.value)}
                            className="flex-1"
                        >
                            <Card
                                className={cn(
                                    "flex-1 px-2 py-2 items-center",
                                    p.value === period && "bg-primary",
                                )}
                            >
                                <Text
                                    className={cn(
                                        "text-sm",
                                        p.value === period && "text-white",
                                    )}
                                >
                                    {p.label}
                                </Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </RowView>
            </RowView>
        </>
    );
}
