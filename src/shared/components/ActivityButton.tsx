import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { formatDurationClock } from "../utils/activity.utils";
import RingChart from "./ui/RingChart";
import Text from "./ui/Text";

export default function ActivityButton() {
    const navigation = useNavigation();
    const goals = useSettingsStore((s) => s.settings.stepGoal);
    const activeActivity = useActiveActivityStore((s) => s.activeActivity);
    const duration = activeActivity.duration;
    const status = activeActivity.status; //idle, paused, activty
    const steps = activeActivity.steps;
    const pct = (steps / goals) * 100;
    const icon =
        status === "idle"
            ? "footsteps"
            : status === "active"
              ? "pause"
              : "play";

    const pingScale = useRef(new Animated.Value(1)).current;
    const pingOpacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        if (status !== "active") {
            pingScale.setValue(1);
            pingOpacity.setValue(0.6);
            return;
        }

        const ping = Animated.loop(
            Animated.parallel([
                Animated.timing(pingScale, {
                    toValue: 1.6,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pingOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        );

        ping.start();
        return () => ping.stop();
    }, [status]);
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("activity" as never)}
            activeOpacity={0.9}
        >
            <View
                className={cn(
                    "relative bg-primary h-20 aspect-square rounded-full justify-center items-center ",
                )}
            >
                {status === "active" && (
                    <Animated.View
                        style={{
                            transform: [{ scale: pingScale }],
                            opacity: pingOpacity,
                        }}
                        className="absolute rounded-full inset-0 border-primary border-2"
                    />
                )}
                {status !== "idle" && (
                    <>
                        <RingChart
                            pct={pct}
                            radius={30}
                            strokeWidth={4}
                            trackWidth={0}
                            strokeLinecap="round"
                            color="white"
                            trackColor="rgba(128,128,128)"
                            gapDeg={32}
                            startDeg={180}
                        />
                        <View className="absolute inset-1 justify-between items-center">
                            {/* <Text className="text-[8px] text-white font-medium">
                        {steps.toLocaleString()}
                    </Text> */}
                            <View className="flex-1 justify-end items-center">
                                <Text className="text-[8px] text-white font-medium">
                                    {formatDurationClock(duration)}
                                </Text>
                            </View>
                        </View>
                    </>
                )}
                <View className="absolute justify-between items-center">
                    <Ionicons
                        name={icon as any}
                        size={28}
                        className="text-white"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}
