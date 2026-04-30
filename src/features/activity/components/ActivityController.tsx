import { ColView, RowView } from "@/shared/components/CustomView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { clsx } from "clsx";
import { Text, TouchableOpacity } from "react-native";
import { useActivityStore } from "../stores/use-activity.store";

export default function ActivityController() {
    const status = useActivityStore((s) => s.status);
    const start = useActivityStore((s) => s.start);
    const pause = useActivityStore((s) => s.pause);
    const resume = useActivityStore((s) => s.resume);
    const finish = useActivityStore((s) => s.stop);
    const discard = useActivityStore((s) => s.discard);

    const isRunning = status === "active";
    const isPaused = status === "paused";

    const handleMain = async () => {
        if (isRunning) {
            await pause();
        } else if (isPaused) {
            await resume();
        } else {
            await start();
        }
    };

    const handleReset = async () => {
        await discard();
    };
    const isDisabled = status === "idle" || isRunning;
    return (
        <RowView className="justify-center items-end gap-6">
            {/* Reset */}
            <ColView className="items-center gap-1.5">
                <TouchableOpacity
                    onPress={handleReset}
                    disabled={isDisabled}
                    className={clsx(
                        "h-20 aspect-square rounded-full bg-card items-center justify-center",
                        isDisabled && "opacity-50",
                    )}
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
                    className={clsx(
                        "h-32 aspect-square rounded-full items-center justify-center",
                        isRunning ? "bg-destructive" : "bg-primary",
                    )}
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

            <ColView className="items-center gap-1.5">
                <TouchableOpacity
                    disabled={isDisabled}
                    className={clsx(
                        "h-20 aspect-square rounded-full bg-primary items-center justify-center",
                        isDisabled && "opacity-50",
                    )}
                    onPress={finish}
                >
                    <Ionicons
                        name="checkmark"
                        size={20}
                        className="text-white"
                    />
                </TouchableOpacity>
                <Text className="text-[10px] text-muted-foreground">
                    Finish
                </Text>
            </ColView>
        </RowView>
    );
}
