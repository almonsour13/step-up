import { ActivityStatus } from "@/features/activity/stores/use-activity.store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "../utils/utils";

type ActivityMetrics = {};
type ActiveActivity = {
    id: string;
    startTime: number;
    pausedTime: number;
    lastPauseTime: number | null;
    status: ActivityStatus;
};

const STORAGE_KEY = "@activity_activity";

class ActivityService {
    private currentActivity: ActiveActivity | null = null;
    private metricsUpdateCallbacks: Array<(metrics: ActivityMetrics) => void> =
        [];

    async start(): Promise<void> {
        if (this.currentActivity) {
            console.error("Activity already in progress!");
            throw new Error("An activity is already in progress");
        }
        try {
            const id = generateId();
            const startTime = Date.now();

            this.currentActivity = {
                id,
                startTime,
                pausedTime: 0,
                lastPauseTime: null,
                status: "active",
            };

            console.log(
                "Activity object created, status:",
                this.currentActivity.status,
            );
            this.save();
        } catch (error) {
            console.error("Error starting activity:", error);
            throw error;
        }
    }
    async resume(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }

        if (this.currentActivity.status === "active") {
            console.warn("Activity is already active");
            return;
        }

        if (this.currentActivity.lastPauseTime) {
            const pauseDuration =
                Date.now() - this.currentActivity.lastPauseTime;
            this.currentActivity.pausedTime += pauseDuration;
            this.currentActivity.lastPauseTime = null;
        }

        this.currentActivity.status = "active";
        console.log(
            "Activity resumed, current status:",
            this.currentActivity.status,
        );
        this.save();
    }
    async pause(): Promise<void> {
        console.log(
            "pauseActivity called, currentActivity:",
            !!this.currentActivity,
        );

        if (!this.currentActivity) {
            console.error("Cannot pause - no activity in progress!");
            throw new Error("No activity in progress");
        }

        if (this.currentActivity.status === "paused") {
            console.warn("Activity is already paused");
            return;
        }

        console.log(
            "Pausing activity, current status:",
            this.currentActivity.status,
        );
        this.currentActivity.status = "paused";
        this.currentActivity.lastPauseTime = Date.now();
        this.save();
    }
    async stop(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }
        try {
            const endTime = Date.now();
            const duration = endTime - this.currentActivity.startTime;

            this.currentActivity = null;
        } catch (error) {
            console.error("Error stopping activity:", error);
            throw error;
        }
        this.save();
    }
    async discard(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }
        try {
            console.log("Discarding activity:", this.currentActivity.id);
            this.currentActivity = null;
            console.log("Activity discarded");
        } catch (error) {
            console.error("Error discarding activity:", error);
            throw error;
        }
    }
    async save(): Promise<void> {
        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(this.currentActivity),
        );
    }
    async restore(): Promise<ActiveActivity | null> {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        this.currentActivity = JSON.parse(raw) as ActiveActivity;
        return this.currentActivity;
    }
    onMetricsUpdate(callback: (metrics: ActivityMetrics) => void): () => void {
        this.metricsUpdateCallbacks.push(callback);

        return () => {
            this.metricsUpdateCallbacks = this.metricsUpdateCallbacks.filter(
                (cb) => cb !== callback,
            );
        };
    }
}

export const activityService = new ActivityService();
