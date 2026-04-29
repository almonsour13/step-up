import { ColView, RowView } from "@/shared/components/CustomView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

type ActivityState = "idle" | "running" | "paused";

export default function ActivityController() {
    const [state, setState] = useState<ActivityState>("idle");

    const isRunning = state === "running";
    const isPaused = state === "paused";

    const handleMain = () => {
        if (state === "idle" || state === "paused") setState("running");
        else setState("paused");
    };

    const handleReset = () => setState("idle");

    return (
        <RowView className="justify-center items-end gap-6">
            {/* Reset */}
            <ColView className="items-center gap-1.5">
                <TouchableOpacity
                    onPress={handleReset}
                    className="h-[52px] aspect-square rounded-full bg-card border border-border items-center justify-center"
                >
                    <Ionicons
                        name="refresh"
                        size={20}
                        className="text-muted-foreground"
                    />
                </TouchableOpacity>
                <Text className="text-[10px] text-muted-foreground">Reset</Text>
            </ColView>

            {/* Main play/pause */}
            <ColView className="items-center gap-1.5">
                <TouchableOpacity
                    onPress={handleMain}
                    activeOpacity={0.8}
                    className="h-24 aspect-square rounded-full bg-primary items-center justify-center"
                >
                    <Ionicons
                        name={isRunning ? "pause" : "play"}
                        size={30}
                        color="white"
                    />
                </TouchableOpacity>
                <Text className="text-[10px] text-muted-foreground">
                    {isRunning ? "Pause" : isPaused ? "Resume" : "Start"}
                </Text>
            </ColView>

            {/* History / lap */}
            <ColView className="items-center gap-1.5">
                <TouchableOpacity className="h-[52px] aspect-square rounded-full bg-card border border-border items-center justify-center">
                    <Ionicons
                        name="flag-outline"
                        size={20}
                        className="text-muted-foreground"
                    />
                </TouchableOpacity>
                <Text className="text-[10px] text-muted-foreground">Lap</Text>
            </ColView>
        </RowView>
    );
}
