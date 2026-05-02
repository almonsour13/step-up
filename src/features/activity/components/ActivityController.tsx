import { ColView, RowView } from "@/shared/components/CustomView";
import { useActiveActivityControl } from "@/shared/hooks/use-active-activity-control";
import { useActiveActivityStore } from "@/shared/stores/use-active-activity.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { clsx } from "clsx";
import { Text, TouchableOpacity } from "react-native";

export default function ActivityController() {
    const activeStatus = useActiveActivityStore(
        (s) => s.activeActivity?.status,
    );
    const activeActivityControl = useActiveActivityControl();

    const handleMain = async () => {
        if (isRunning) {
            activeActivityControl.pause();
        } else if (isPaused) {
            activeActivityControl.resume();
        } else {
            activeActivityControl.start();
        }
    };

    const handleReset = async () => {
        activeActivityControl.discard();
        // await discard();
    };
    const handleSave = async () => {
        activeActivityControl.save();
    };

    const isRunning = activeStatus === "active";
    const isPaused = activeStatus === "paused";
    const isDisabled = activeStatus === "idle" || isRunning;
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
                        size={36}
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
                    onPress={handleSave}
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
