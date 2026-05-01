import { useActivityStore } from "@/features/activity/stores/use-activity.store";
import { formatDuration } from "@/shared/utils/activity.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { clsx } from "clsx";
import { usePathname, useRouter } from "expo-router";
import { memo, useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { RowView } from "./CustomView";

function ActiveActivityBanner() {
    const translateY = useRef(new Animated.Value(0)).current;
    const isHidden = useRef(false);

    const router = useRouter();
    const pathname = usePathname();
    const duration = useActivityStore((s) => s.duration);
    const steps = useActivityStore((s) => s.steps);
    const status = useActivityStore((s) => s.status);
    const start = useActivityStore((s) => s.start);
    const pause = useActivityStore((s) => s.pause);
    const resume = useActivityStore((s) => s.resume);
    const isRunning = status === "active";
    const isPaused = status === "paused";

    const stats = [
        {
            label: "Duration",
            value: formatDuration(duration),
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
            await pause();
        } else if (isPaused) {
            await resume();
        } else {
            await start();
        }
    };

    const hide = pathname === "/activity" || status === "idle";
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
        <Animated.View>
            <TouchableOpacity
                className="p-4 py-2 bg-primary"
                onPress={() => router.push("/activity")}
            >
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
                                            <Text className="text- font-normal text-muted pb-1">
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
            </TouchableOpacity>
        </Animated.View>
    );
}
export default memo(ActiveActivityBanner);
