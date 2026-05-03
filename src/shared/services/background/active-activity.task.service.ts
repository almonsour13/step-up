// services/background-step.task.ts
import { logger } from "@/shared/utils/logger";
import * as BackgroundTask from "expo-background-task";
import { Pedometer } from "expo-sensors";
import * as TaskManager from "expo-task-manager";
import { activeActivityService } from "../active-activity.service";

export const BACKGROUND_STEP_TASK = "BACKGROUND_STEP_TASK";

TaskManager.defineTask(BACKGROUND_STEP_TASK, async () => {
    try {
        const metrics = activeActivityService.getCurrentMetrics();

        if (!metrics || metrics.status !== "active") {
            return BackgroundTask.BackgroundTaskResult.Failed;
        }

        const end = new Date();
        const start = new Date(end.getTime() - 60_000);

        const result = await Pedometer.getStepCountAsync(start, end);

        logger.log("[BackgroundStepTask] Steps in last 60s", {
            steps: result.steps,
        });
        // await activeActivityService.addSteps(result.steps);

        return BackgroundTask.BackgroundTaskResult.Success;
    } catch (error) {
        logger.error("[BackgroundStepTask] Task failed", { error });
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
});

export async function registerBackgroundStepTask(): Promise<void> {
    const isRegistered =
        await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (isRegistered) return;
    await BackgroundTask.registerTaskAsync(BACKGROUND_STEP_TASK, {
        minimumInterval: 60,
    });

    logger.log("[BackgroundStepTask] Task registered");
}

export async function unregisterBackgroundStepTask(): Promise<void> {
    const isRegistered =
        await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (!isRegistered) return;
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_STEP_TASK);

    logger.log("[BackgroundStepTask] Task unregistered");
}
