import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { StatItem } from "@/shared/utils/activity-stats.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { useActivityHistorySummar } from "../hooks/use-activity-history-summary";

function ActivityHistorySummary() {
    const activitySummary = useActivityHistorySummar();
    return (
        <ColView>
            <ColView className="px-4 gap-1">
                <RowView className="gap-1">
                    {activitySummary.slice(0, 2).map((s) => (
                        <AcitivitySummaryCard key={s.label} stat={s} />
                    ))}
                </RowView>
                <RowView className="gap-1">
                    {activitySummary.slice(2).map((s) => (
                        <AcitivitySummaryCard key={s.label} stat={s} />
                    ))}
                </RowView>
            </ColView>
        </ColView>
    );
}
function AcitivitySummaryCard({ stat }: { stat: StatItem }) {
    return (
        <Card className="flex-1">
            <ColView className="gap-1">
                <RowView className="gap-1">
                    <Ionicons
                        name={stat.icon}
                        size={12}
                        className="text-primary"
                    />
                    <Text className="text-xs text-muted-foreground">
                        {stat.label}
                    </Text>
                </RowView>
                <Text className="text-2xl leading-none font-medium text-foreground">
                    {stat.value}
                    {stat.unit && (
                        <Text className="text-[10px] font-normal text-muted-foreground">
                            {" "}
                            {stat.unit}
                        </Text>
                    )}
                </Text>
            </ColView>
        </Card>
    );
}
export default memo(ActivityHistorySummary);
