import { STORAGE_KEYS } from "../constants/constant";
import { Activity, ActivityStatus } from "../types/type";
import { logger } from "../utils/logger";
import { generateId } from "../utils/utils";
import { stepService } from "./step.service";
import { activityStorageService } from "./storage/activity.storage.service";
import { settingsService } from "./storage/settings.storage.service";
import { StorageService } from "./storage/storage.service";

type Metrics = {
    duration: number;
    steps: number;
    status?: ActivityStatus;
};
type ActiveActivity = {
    id: string;
    startTime: number;
    pausedTime: number;
    lastPauseTime: number | null;
    status: ActivityStatus;
    steps: number;
};

class ActiveActivityService {
    private activeActivityStore = new StorageService<ActiveActivity>(
        STORAGE_KEYS.ACTIVE_ACTIVITY,
    );
    private activeActivity: ActiveActivity | null = null;
    private readonly SESSION_UPDATE_INTERVAL = 1000;
    private activeActivityUpdateInterval: ReturnType<
        typeof setInterval
    > | null = null;
    private metricsUpdateCallBacks: Array<(metrics: Metrics) => void> = [];
    // REMOVE: stepRatePerSecond — steps now come from the real pedometer
    // ADD: handle to unsubscribe from stepService
    private stepUnsubscribe: (() => void) | null = null;

    getCurrentMetrics(): Metrics | null {
        if (!this.activeActivity) return null;

        return {
            duration: this.getElapsedMs(),
            steps: this.activeActivity.steps,
            status: this.activeActivity.status,
        };
    }

    private getElapsedMs(): number {
        if (!this.activeActivity) return 0;

        const { startTime, pausedTime, lastPauseTime, status } =
            this.activeActivity;

        const extraPaused =
            status === "paused" && lastPauseTime != null
                ? Date.now() - lastPauseTime
                : 0;

        return Date.now() - startTime - pausedTime - extraPaused;
    }

    private notifyMetricsUpdate(): void {
        if (!this.activeActivity) return;

        // REMOVE: fake step calculation based on elapsed time
        // Steps are now updated directly from stepService via subscribeToSteps()
        const stats: Metrics = {
            duration: this.getElapsedMs(),
            steps: this.activeActivity.steps,
        };

        this.metricsUpdateCallBacks.forEach((callback) => {
            try {
                callback(stats);
            } catch (error) {
                logger.error("[ActiveActivityService] Metrics callback error", {
                    error,
                });
            }
        });
    }

    // ADD: subscribe to real pedometer updates and accumulate steps
    private subscribeToSteps(): void {
        // Guard: don't double-subscribe
        if (this.stepUnsubscribe) return;

        this.stepUnsubscribe = stepService.onStepUpdate((steps) => {
            if (!this.activeActivity || this.activeActivity.status !== "active")
                return;

            this.activeActivity.steps = steps;

            logger.log("[ActiveActivityService] Step update received", {
                steps: this.activeActivity.steps,
            });
        });
    }

    // ADD: unsubscribe cleanly from step updates
    private unsubscribeFromSteps(): void {
        this.stepUnsubscribe?.();
        this.stepUnsubscribe = null;
    }

    private startSession(): void {
        this.stopSession();

        this.activeActivityUpdateInterval = setInterval(() => {
            if (!this.activeActivity) {
                this.stopSession();
                return;
            }

            if (this.activeActivity.status === "active") {
                this.notifyMetricsUpdate();
            }
        }, this.SESSION_UPDATE_INTERVAL);

        // ADD: start listening for steps alongside the timer
        this.subscribeToSteps();
    }

    private stopSession(): void {
        if (this.activeActivityUpdateInterval) {
            clearInterval(this.activeActivityUpdateInterval);
            this.activeActivityUpdateInterval = null;
        }

        // ADD: stop listening for steps when session pauses/stops
        this.unsubscribeFromSteps();
    }

    async start(): Promise<void> {
        if (this.activeActivity) {
            logger.warn(
                "[ActiveActivityService] Start blocked: activity already exists",
                { id: this.activeActivity.id },
            );
            throw new Error("An activity is already in progress");
        }

        try {
            this.activeActivity = {
                id: generateId(),
                startTime: Date.now(),
                pausedTime: 0,
                lastPauseTime: null,
                status: "active",
                steps: 0,
            };

            await this.activeActivityStore.set(this.activeActivity);

            logger.log("[ActiveActivityService] Activity started", {
                id: this.activeActivity.id,
                startTime: this.activeActivity.startTime,
                status: this.activeActivity.status,
            });

            // ADD: start the pedometer alongside the session
            await stepService.start();
            // await registerBackgroundStepTask();
            // await activityNotificationService.show(0, 0);
            this.startSession();
        } catch (error) {
            logger.error("[ActiveActivityService] Failed to start activity", {
                error,
            });
            throw error;
        }
    }

    async pause(): Promise<void> {
        if (!this.activeActivity) {
            logger.error(
                "[ActiveActivityService] Pause failed: no active activity",
            );
            throw new Error("No activity in progress");
        }

        if (this.activeActivity.status === "paused") {
            logger.warn("[ActiveActivityService] Activity already paused", {
                id: this.activeActivity.id,
            });
            return;
        }

        this.activeActivity.status = "paused";
        this.activeActivity.lastPauseTime = Date.now();

        await this.activeActivityStore.update(this.activeActivity);

        logger.log("[ActiveActivityService] Activity paused", {
            id: this.activeActivity.id,
            pausedAt: this.activeActivity.lastPauseTime,
        });

        // ADD: pause the pedometer too; stopSession already unsubscribes steps
        // await activityNotificationService.update(this.getElapsedMs(), this.activeActivity.steps);
        await stepService.stop();
        this.stopSession();
    }

    async resume(): Promise<void> {
        if (!this.activeActivity) {
            logger.error(
                "[ActiveActivityService] Resume failed: no active activity",
            );
            throw new Error("No activity in progress");
        }

        if (this.activeActivity.status === "active") {
            logger.warn("[ActiveActivityService] Activity already active", {
                id: this.activeActivity.id,
            });
            return;
        }

        if (this.activeActivity.lastPauseTime != null) {
            const pauseDuration =
                Date.now() - this.activeActivity.lastPauseTime;

            this.activeActivity.pausedTime += pauseDuration;
            this.activeActivity.lastPauseTime = null;

            logger.log("[ActiveActivityService] Pause duration applied", {
                id: this.activeActivity.id,
                pauseDuration,
                totalPausedTime: this.activeActivity.pausedTime,
            });
        }

        this.activeActivity.status = "active";

        await this.activeActivityStore.update(this.activeActivity);

        logger.log("[ActiveActivityService] Activity resumed", {
            id: this.activeActivity.id,
            status: this.activeActivity.status,
        });

        // ADD: restart the pedometer on resume; startSession re-subscribes steps
        await stepService.start();
        // await activityNotificationService.update(this.getElapsedMs(), this.activeActivity.steps);
        this.startSession();
    }

    async stop(): Promise<Activity> {
        if (!this.activeActivity) {
            logger.warn(
                "[ActiveActivityService] Stop called but no active activity",
            );
            throw new Error("No activity in progress");
        }

        try {
            const settings = await settingsService.getSettings();
            logger.log("[ActiveActivityService] Stopping activity", {
                id: this.activeActivity.id,
                startTime: this.activeActivity.startTime,
                steps: this.activeActivity.steps,
            });

            const endTime = new Date().toISOString();

            const formattedNewActivity = {
                id: this.activeActivity.id,
                startTime: new Date(
                    this.activeActivity.startTime,
                ).toISOString(),
                endTime,
                duration: this.getElapsedMs(),
                steps: this.activeActivity.steps,
                goal: settings.stepGoal,
                createdAt: new Date().toISOString(),
            };

            await activityStorageService.save(formattedNewActivity);
            await this.activeActivityStore.remove();

            logger.log("[ActiveActivityService] Activity stopped and cleared", {
                id: this.activeActivity.id,
                endTime,
            });

            this.activeActivity = null;

            // ADD: stop pedometer when the whole activity ends
            await stepService.stop();
            // await unregisterBackgroundStepTask();
            // await activityNotificationService.dismiss();
            this.stopSession();

            return formattedNewActivity;
        } catch (error) {
            logger.error("[ActiveActivityService] Error stopping activity", {
                error,
            });
            throw error;
        }
    }

    async discard(): Promise<void> {
        if (!this.activeActivity) {
            logger.error(
                "[ActiveActivityService] Discard failed: no active activity",
            );
            throw new Error("No activity in progress");
        }

        try {
            logger.log("[ActiveActivityService] Discarding activity", {
                id: this.activeActivity.id,
            });

            this.activeActivity = null;

            // ADD: stop pedometer and clean up on discard too
            await stepService.stop();
            // await unregisterBackgroundStepTask();
            // await activityNotificationService.dismiss();
            this.stopSession();

            logger.log("[ActiveActivityService] Activity discarded");
        } catch (error) {
            logger.error("[ActiveActivityService] Error discarding activity", {
                error,
            });
            throw error;
        }
    }

    async restore(): Promise<ActiveActivity | null> {
        try {
            const stored = await this.activeActivityStore.get();

            if (stored) {
                this.activeActivity = stored;

                logger.log("[ActiveActivityService] Activity restored", {
                    id: stored.id,
                    status: stored.status,
                });

                if (stored.status === "active") {
                    // await activityNotificationService.show(
                    //     // ADD
                    //     this.getElapsedMs(),
                    //     stored.steps,
                    // );
                    await stepService.start();
                    this.startSession();
                } else {
                    this.stopSession();
                }

                return stored;
            } else {
                logger.log("[ActiveActivityService] No activity to restore");
            }
        } catch (error) {
            logger.error("[ActiveActivityService] Failed to restore activity", {
                error,
            });
        }
        return null;
    }
    async addSteps(steps: number): Promise<void> {
        if (!this.activeActivity) return;

        this.activeActivity.steps += steps;

        // Persist so steps survive a full app kill + restore
        await this.activeActivityStore.update(this.activeActivity);

        logger.log("[ActiveActivityService] Background steps added", {
            added: steps,
            total: this.activeActivity.steps,
        });
    }

    onStatsUpdate(callback: (metric: Metrics) => void): () => void {
        this.metricsUpdateCallBacks.push(callback);

        return () => {
            this.metricsUpdateCallBacks = this.metricsUpdateCallBacks.filter(
                (cb) => cb !== callback,
            );
        };
    }
}

export const activeActivityService = new ActiveActivityService();
