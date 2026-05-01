import ActivityDetailsDrawer, {
    ActivityDetailsDrawerHandle,
} from "@/shared/components/ActivityDetailsDrawer";
import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import RingChart from "@/shared/components/ui/RingChart";
import { Activity } from "@/shared/types/type";
import { cn } from "@/shared/utils/cn";
import { formatActivityDate } from "@/shared/utils/utils";
import { format } from "date-fns";
import { memo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    activity: Activity;
    className?: string;
}
function ActivityCard({ activity, className }: Props) {
    const drawerRef = useRef<ActivityDetailsDrawerHandle>(null);
    const start = new Date(activity.startTime);
    const end = new Date(activity.endTime);
    const progress = Math.min((activity.steps / activity.goalStep) * 100, 100);
    const met = activity.steps >= activity.goalStep;
    return (
        <>
            <TouchableOpacity
                key={activity.id}
                onPress={() => {
                    drawerRef.current?.open();
                    drawerRef.current?.openWithActivity?.(activity);
                }}
            >
                <Card className={cn("", className)}>
                    <RowView className="items-center gap-4">
                        <ColView className="flex-1 gap-1">
                            <Text className="text-[11px] text-muted-foreground">
                                {formatActivityDate(start)} ·{" "}
                                {format(start, "p")} – {format(end, "p")}
                            </Text>
                            <RowView className="items-baseline gap-1">
                                <Text className="text-[22px] leading-none font-medium text-primary">
                                    {activity.steps.toLocaleString()}
                                </Text>
                                <Text className="text-[11px] text-muted-foreground">
                                    / {activity.goalStep.toLocaleString()} steps
                                </Text>
                            </RowView>
                        </ColView>

                        <View className="relative items-center justify-center">
                            <RingChart
                                pct={progress}
                                radius={20}
                                strokeWidth={4}
                                strokeLinecap="round"
                                trackColor="rgba(128,128,128,0.1)"
                                trackWidth={3}
                                color={met ? "#639922" : "white"}
                            />
                            <Text className="absolute text-[10px] font-medium text-primary">
                                {Math.round(progress)}%
                            </Text>
                        </View>
                    </RowView>
                </Card>
            </TouchableOpacity>
            <ActivityDetailsDrawer ref={drawerRef} />
        </>
    );
}
export default memo(ActivityCard);
