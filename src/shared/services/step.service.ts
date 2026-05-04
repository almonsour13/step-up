// step.service.ts
import Constants from "expo-constants";
import { Pedometer } from "expo-sensors";
import { logger } from "../utils/logger";
import { fakeStepService } from "./fake-step.service";

export type StepUpdateCallback = (steps: number) => void;

// FIX: was !== which inverted the logic
const IS_EXPO_GO = Constants.appOwnership !== "expo";

class StepService {
    private isAvailableOnDevice: boolean | null = null;
    private subscription: Pedometer.Subscription | null = null;
    private listeners: StepUpdateCallback[] = [];
    private fakeUnsubscribe: (() => void) | null = null;
    private stepOffset: number = 0; // ADD
    private lastStepCount: number = 0;

    // -------------------------
    // AVAILABILITY
    // -------------------------
    private async isAvailable(): Promise<boolean> {
        if (IS_EXPO_GO) return true;
        if (this.isAvailableOnDevice !== null) return this.isAvailableOnDevice;

        try {
            const available = await Pedometer.isAvailableAsync();
            this.isAvailableOnDevice = available;

            if (!available) {
                logger.warn("[StepService] Pedometer not available");
            } else {
                logger.log("[StepService] Pedometer available");
            }

            return available;
        } catch (error) {
            logger.error("[StepService] Availability check failed", { error });
            this.isAvailableOnDevice = false;
            return false;
        }
    }

    // -------------------------
    // PERMISSIONS
    // -------------------------
    private async requestPermissions(): Promise<boolean> {
        if (IS_EXPO_GO) return true;

        try {
            const { status: existing } = await Pedometer.getPermissionsAsync();
            if (existing === "granted") return true;

            const { status } = await Pedometer.requestPermissionsAsync();

            if (status !== "granted") {
                logger.warn("[StepService] Permission denied");
                return false;
            }

            logger.log("[StepService] Permission granted");
            return true;
        } catch (error) {
            logger.error("[StepService] Permission request failed", { error });
            return false;
        }
    }

    // -------------------------
    // START
    // -------------------------
    async start(): Promise<void> {
        // Reset offset on fresh start
        this.stepOffset = 0; // ADD
        this.lastStepCount = 0; // ADD
        logger.log("[StepService] Starting...");

        if (IS_EXPO_GO) {
            await fakeStepService.start();
            this.fakeUnsubscribe = fakeStepService.onStepUpdate((steps) => {
                logger.log("[StepService] Fake steps update", { steps });
                this.listeners.forEach((cb) => cb(steps));
            });
            return;
        }

        const available = await this.isAvailable();
        if (!available) return;

        const granted = await this.requestPermissions();
        if (!granted) return;

        this.subscription = Pedometer.watchStepCount((result) => {
            logger.log("[StepService] Real steps update", {
                steps: result.steps,
            });
            this.listeners.forEach((cb) => cb(result.steps));
        });

        logger.log("[StepService] Pedometer subscription started");
    }

    // -------------------------
    // PAUSE
    // -------------------------
    async pause(): Promise<void> {
        logger.log("[StepService] Pausing...");

        if (IS_EXPO_GO) {
            // FIX: pause fake service (preserves step count)
            await fakeStepService.pause();
            // FIX: unsubscribe but keep fakeUnsubscribe ref for resume
            this.fakeUnsubscribe?.();
            this.fakeUnsubscribe = null;
            logger.log("[StepService] Fake service paused");
            return;
        }

        this.stepOffset += this.lastStepCount; // ADD
        this.lastStepCount = 0; // ADD
        // FIX: remove subscription but don't null isAvailableOnDevice
        this.subscription?.remove();
        this.subscription = null;

        logger.log("[StepService] Pedometer subscription paused");
    }

    // -------------------------
    // RESUME
    // -------------------------
    async resume(): Promise<void> {
        logger.log("[StepService] Resuming...");

        if (IS_EXPO_GO) {
            // FIX: resume fake service (continues from last step count)
            await fakeStepService.resume();
            // FIX: re-subscribe listeners to fake updates
            this.fakeUnsubscribe = fakeStepService.onStepUpdate((steps) => {
                logger.log("[StepService] Fake steps update", { steps });
                this.listeners.forEach((cb) => cb(steps));
            });
            return;
        }

        this.subscription = Pedometer.watchStepCount((result) => {
            this.lastStepCount = result.steps;

            // ADD: always emit offset + current window steps
            const totalSteps = this.stepOffset + result.steps;

            logger.log("[StepService] Real steps update", { totalSteps });
            this.listeners.forEach((cb) => cb(totalSteps));
        });

        logger.log("[StepService] Pedometer subscription resumed");
    }

    // -------------------------
    // STOP
    // -------------------------
    async stop(): Promise<void> {
        // Reset offset on fresh start
        this.stepOffset = 0; // ADD
        this.lastStepCount = 0; // ADD
        logger.log("[StepService] Stopping...");

        if (IS_EXPO_GO) {
            await fakeStepService.stop();
            this.fakeUnsubscribe?.();
            this.fakeUnsubscribe = null;
            logger.log("[StepService] Fake service stopped");
            return;
        }

        this.subscription?.remove();
        this.subscription = null;

        logger.log("[StepService] Pedometer subscription stopped");
    }

    // -------------------------
    // LISTENER
    // -------------------------
    onStepUpdate(callback: StepUpdateCallback): () => void {
        this.listeners.push(callback);
        logger.log("[StepService] Listener added", {
            total: this.listeners.length,
        });

        return () => {
            this.listeners = this.listeners.filter((cb) => cb !== callback);
            logger.log("[StepService] Listener removed", {
                total: this.listeners.length,
            });
        };
    }
}

export const stepService = new StepService();
