import { useActivityStatistic } from "@/features/activity/hooks/use-activity-statistic";
import { useActivityStore } from "@/features/activity/stores/use-activity.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { clsx } from "clsx";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { RowView } from "./CustomView";

export default function ActiveActivityBanner() {
    const translateY = useRef(new Animated.Value(0)).current;
    const isHidden = useRef(false);

    const status = useActivityStore((s) => s.status);
    const router = useRouter();
    const pathname = usePathname();
    const start = useActivityStore((s) => s.start);
    const pause = useActivityStore((s) => s.pause);
    const resume = useActivityStore((s) => s.resume);
    const isRunning = status === "active";
    const isPaused = status === "paused";
    const stats = useActivityStatistic();

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
    }, [pathname]);

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
                                    className="items-center gap-1"
                                >
                                    <Ionicons
                                        name={stat.icon}
                                        size={20}
                                        className="text-white"
                                    />
                                    <Text className="text-xl text-white font-medium">
                                        {stat.value}{" "}
                                        {stat.unit && (
                                            <Text className="text-xs text-muted pb-1">
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
