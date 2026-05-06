import { formatDurationClock } from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { clsx } from "clsx";
import { memo, useEffect, useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { useActiveActivityControl } from "../hooks/use-active-activity-control";
import { useActiveActivityStore } from "../stores/use-active-activity.store";
import { RowView } from "./CustomView";
import Card from "./ui/Card";
import Text from "./ui/Text";

function ActiveActivityBanner() {
    const navigation = useNavigation();
    const translateY = useRef(new Animated.Value(0)).current;
    const isHidden = useRef(false);

    const routeName = useNavigationState(
        (state) => state.routes[state.index].name,
    );
    const activeActivityControl = useActiveActivityControl();

    const activeActivity = useActiveActivityStore((s) => s.activeActivity);
    const status = activeActivity.status;
    const duration = activeActivity.duration;
    const steps = activeActivity.steps;
    const isRunning = status === "active";
    const isPaused = status === "paused";
    const stats = [
        {
            label: "Duration",
            value: formatDurationClock(duration),
            icon: "time-outline" as const,
        },
        {
            label: "Steps",
            value: steps.toLocaleString(),
            icon: "footsteps-outline" as const,
            unit: "",
        },
    ];
    const handleStateAction = async () => {
        if (isRunning) {
            activeActivityControl.pause();
        } else if (isPaused) {
            activeActivityControl.resume();
        } else {
            activeActivityControl.start();
        }
    };

    const hide = routeName === "activity" || status === "idle";
    useEffect(() => {
        if (hide === isHidden.current) return;
        isHidden.current = hide;
        Animated.spring(translateY, {
            toValue: hide ? 120 : 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 20,
        }).start();
    }, [hide]);

    if (hide) return null;
    return (
        <>
            {/* <View className="absolute bottom-24 right-4 z-10 bg-primary h-20 w-20 rounded-full" /> */}
            <Animated.View className="hidden">
                <TouchableOpacity
                    onPress={() => navigation.navigate("activity" as never)}
                >
                    <Card className="p-4 py-2 pb-4 -mb-2 rounded-b-none bg-primary">
                        <RowView className="justify-between items-center">
                            <RowView className="gap-4">
                                {stats.map((stat, i) => {
                                    return (
                                        <RowView
                                            key={stat.label}
                                            className="items-center gap-2"
                                        >
                                            <Ionicons
                                                name={stat.icon}
                                                size={16}
                                                className="text-white/50"
                                            />
                                            <Text className="text-base text-white font-medium">
                                                {stat.value}{" "}
                                                {stat.unit && (
                                                    <Text className="text- font-normal text-mut   ed pb-1">
                                                        {stat.unit}
                                                    </Text>
                                                )}
                                            </Text>
                                        </RowView>
                                    );
                                })}
                            </RowView>
                            <TouchableOpacity
                                onPress={handleStateAction}
                                className={clsx(
                                    "rounded-full aspect-square justify-center items-center",
                                )}
                            >
                                <Ionicons
                                    name={
                                        status === "active"
                                            ? "pause-circle"
                                            : "play-circle"
                                    }
                                    size={40}
                                    className="text-white"
                                />
                            </TouchableOpacity>
                        </RowView>
                    </Card>
                </TouchableOpacity>
            </Animated.View>
        </>
    );
}
export default memo(ActiveActivityBanner);
