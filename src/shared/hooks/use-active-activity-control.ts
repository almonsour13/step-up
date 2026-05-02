import { ToastAndroid } from "react-native";
import { activityService } from "../services/activity.service";
import { useActiveActivityStore } from "../stores/use-active-activity.store";
import { useActivityStore } from "../stores/use-activity.store";

export const useActiveActivityControl = () => {
    const addActivity = useActivityStore((s) => s.addActivity);
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
            goalSteps: 10000,
        });
        activityService.start();
    };

    const pause = async () => {
        if (activeActivity.status !== "active") return;

        console.log("Pausing activity");
        setActiveStatus("paused");
        activityService.pause();
    };

    const resume = async () => {
        if (activeActivity.status !== "paused") return;

        console.log("Resuming activity");
        setActiveStatus("active");
        activityService.resume();
    };

    const stop = async () => {
        console.log("Stopping activity");
        clearActiveActivity();
        activityService.stop();
    };

    const save = async () => {
        clearActiveActivity();
        const newActivity = await activityService.stop();
        addActivity(newActivity);
        ToastAndroid.show("Activity saved", ToastAndroid.SHORT);
    };

    const discard = async () => {
        console.log("Discarding activity");

        // ❌ no save
        clearActiveActivity();
        activityService.discard();
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
