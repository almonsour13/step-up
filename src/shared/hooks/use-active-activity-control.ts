import { ToastAndroid } from "react-native";
import { activeActivityService } from "../services/active-activity.service";
import { useActiveActivityStore } from "../stores/use-active-activity.store";
import { useActivityStore } from "../stores/use-activity.store";
import { useSettingsStore } from "../stores/use-settings.store";

export const useActiveActivityControl = () => {
    const addActivity = useActivityStore((s) => s.addActivity);
    const settings = useSettingsStore((s) => s.settings);
    const {
        setActiveActivity,
        setActiveStatus,
        clearActiveActivity,
        activeActivity,
    } = useActiveActivityStore();

    const start = async () => {
        if (activeActivity.status === "active") return;

        console.log("Starting activity");

        setActiveActivity({
            status: "active",
            duration: 0,
            steps: 0,
            goalSteps: settings.stepGoal,
        });
        activeActivityService.start(settings.stepGoal);
    };

    const pause = async () => {
        if (activeActivity.status !== "active") return;

        console.log("Pausing activity");
        setActiveStatus("paused");
        activeActivityService.pause();
    };

    const resume = async () => {
        if (activeActivity.status !== "paused") return;

        console.log("Resuming activity");
        setActiveStatus("active");
        activeActivityService.resume();
    };

    const stop = async () => {
        console.log("Stopping activity");
        clearActiveActivity();
        activeActivityService.stop();
    };

    const save = async () => {
        clearActiveActivity();
        const newActivity = await activeActivityService.stop();
        addActivity(newActivity);
        ToastAndroid.show("Activity saved", ToastAndroid.SHORT);
    };

    const discard = async () => {
        console.log("Discarding activity");

        // ❌ no save
        clearActiveActivity();
        activeActivityService.discard();
    };

    return {
        start,
        pause,
        resume,
        stop,
        save,
        discard,
    };
};
