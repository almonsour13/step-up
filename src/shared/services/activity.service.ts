import { ActivityStatus } from "@/features/activity/stores/use-activity.store";
import { activityStorageService } from "@/shared/services/activity-storage.service";
import { generateId } from "../utils/utils";
import { stepCounterService } from "./step-counter.service";

type ActivityStats = {
    duration: number;
    steps: number;
};

type ActiveActivity = {
    id: string;
    startTime: number;
    pausedTime: number;
    lastPauseTime: number | null;
    status: ActivityStatus;
    steps: number;
};

class ActivityService {
    private currentActivity: ActiveActivity | null = null;
    private stepCounterUnsubscribe: (() => void) | null = null;
    private statsUpdateCallbacks: Array<(stats: ActivityStats) => void> = [];
    private sessionUpdateInterval: ReturnType<typeof setInterval> | null = null;
    private readonly SESSION_UPDATE_INTERVAL = 1000;
    private stepOffset = 0;
    private goalStep = 0;
    // ─── Private: Time Calculation ─────────────────────────────────────────

    private getElapsedMs(): number {
        if (!this.currentActivity) return 0;

        const { startTime, pausedTime, lastPauseTime, status } =
            this.currentActivity;

        const extraPaused =
            status === "paused" && lastPauseTime != null
                ? Date.now() - lastPauseTime
                : 0;

        return Date.now() - startTime - pausedTime - extraPaused;
    }

    // ─── Private: Stats Updates ────────────────────────────────────────────

    private notifyStatsUpdate(): void {
        if (!this.currentActivity) return;

        const stats: ActivityStats = {
            duration: this.getElapsedMs(),
            steps: this.currentActivity.steps,
        };

        this.statsUpdateCallbacks.forEach((callback) => {
            try {
                callback(stats);
            } catch (error) {
                console.error("Error in stats update callback:", error);
            }
        });
    }

    private startSession(): void {
        this.stopSession();

        this.sessionUpdateInterval = setInterval(() => {
            if (!this.currentActivity) {
                this.stopSession();
                return;
            }

            if (this.currentActivity.status === "active") {
                this.notifyStatsUpdate();
            }
        }, this.SESSION_UPDATE_INTERVAL);
    }

    private stopSession(): void {
        if (this.sessionUpdateInterval) {
            clearInterval(this.sessionUpdateInterval);
            this.sessionUpdateInterval = null;
        }
    }

    // ─── Private: Step Subscription ────────────────────────────────────────

    private subscribeToStepUpdates(offset: number): void {
        this.unsubscribeFromStepUpdates();

        this.stepOffset = offset;

        this.stepCounterUnsubscribe = stepCounterService.onStepUpdate(
            (sensorSteps) => {
                if (!this.currentActivity) return;

                this.currentActivity.steps = this.stepOffset + sensorSteps;

                console.log(
                    `Steps updated: offset(${this.stepOffset}) + sensor(${sensorSteps}) = ${this.currentActivity.steps}`,
                );
            },
        );
    }

    private unsubscribeFromStepUpdates(): void {
        if (this.stepCounterUnsubscribe) {
            this.stepCounterUnsubscribe();
            this.stepCounterUnsubscribe = null;
        }
    }

    // ─── Public API ────────────────────────────────────────────────────────

    async start(goalStep = 5000): Promise<void> {
        if (this.currentActivity) {
            throw new Error("An activity is already in progress");
        }
        this.goalStep = goalStep;
        try {
            this.currentActivity = {
                id: generateId(),
                startTime: Date.now(),
                pausedTime: 0,
                lastPauseTime: null,
                status: "active",
                steps: 0,
            };

            console.log(
                "Activity started, status:",
                this.currentActivity.status,
            );

            await stepCounterService.start();
            this.subscribeToStepUpdates(0);
            this.startSession();
        } catch (error) {
            this.currentActivity = null;
            this.unsubscribeFromStepUpdates();
            console.error("Error starting activity:", error);
            throw error;
        }
    }

    async pause(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }

        if (this.currentActivity.status === "paused") {
            console.warn("Activity is already paused");
            return;
        }

        this.unsubscribeFromStepUpdates();
        await stepCounterService.pause();
        this.stopSession();

        this.currentActivity.status = "paused";
        this.currentActivity.lastPauseTime = Date.now();

        console.log("Activity paused, status:", this.currentActivity.status);
    }

    async resume(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }

        if (this.currentActivity.status === "active") {
            console.warn("Activity is already active");
            return;
        }

        if (this.currentActivity.lastPauseTime != null) {
            const pauseDuration =
                Date.now() - this.currentActivity.lastPauseTime;

            this.currentActivity.pausedTime += pauseDuration;
            this.currentActivity.lastPauseTime = null;
        }

        this.currentActivity.status = "active";

        await stepCounterService.resume();
        this.subscribeToStepUpdates(this.currentActivity.steps);
        this.startSession();

        console.log("Activity resumed, status:", this.currentActivity.status);
    }

    async stop(): Promise<ActivityStats> {
        if (!this.currentActivity) {
            console.warn(
                "[ActivityService] Stop called but no active activity",
            );
            throw new Error("No activity in progress");
        }

        try {
            console.log("[ActivityService] Stopping activity...", {
                id: this.currentActivity.id,
                startTime: this.currentActivity.startTime,
                currentSteps: this.currentActivity.steps,
            });

            const endTime = new Date().toISOString();

            const stats: ActivityStats = {
                duration: this.getElapsedMs(),
                steps: this.currentActivity.steps,
            };

            await activityStorageService.save({
                id: this.currentActivity.id,
                startTime: new Date(
                    this.currentActivity.startTime,
                ).toISOString(),
                endTime,
                duration: stats.duration,
                steps: stats.steps,
                goalStep: this.goalStep,
                createdAt: new Date().toISOString(),
            });

            console.log("[ActivityService] Activity saved successfully", {
                id: this.currentActivity.id,
                duration: stats.duration,
                steps: stats.steps,
            });

            this.unsubscribeFromStepUpdates();
            await stepCounterService.stop();
            this.stopSession();
            this.stepOffset = 0;

            console.log(
                "[ActivityService] Step counter stopped and session cleared",
            );

            this.currentActivity = null;

            console.log("[ActivityService] Activity fully stopped");

            return stats;
        } catch (error) {
            console.error("[ActivityService] Error stopping activity:", error);
            throw error;
        }
    }
    async discard(): Promise<void> {
        if (!this.currentActivity) {
            throw new Error("No activity in progress");
        }

        try {
            console.log("Discarding activity:", this.currentActivity.id);

            this.unsubscribeFromStepUpdates();
            await stepCounterService.stop();
            this.stopSession();
            this.stepOffset = 0;

            this.currentActivity = null;

            console.log("Activity discarded");
        } catch (error) {
            console.error("Error discarding activity:", error);
            throw error;
        }
    }

    onStatsUpdate(callback: (stats: ActivityStats) => void): () => void {
        this.statsUpdateCallbacks.push(callback);

        return () => {
            this.statsUpdateCallbacks = this.statsUpdateCallbacks.filter(
                (cb) => cb !== callback,
            );
        };
    }
}

export const activityService = new ActivityService();
