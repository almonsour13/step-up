import Constants from "expo-constants";
import { Pedometer } from "expo-sensors";
import { logger } from "../utils/logger";
import { fakeStepService } from "./fake-step.service";

export type StepUpdateCallback = (steps: number) => void;

const IS_EXPO_GO = Constants.appOwnership === "expo";

class StepService {
    private isAvailableOnDevice: boolean | null = null;
    private subscription: Pedometer.Subscription | null = null;
    private listeners: StepUpdateCallback[] = [];
    private fakeUnsubscribe: (() => void) | null = null;

    // -------------------------
    // AVAILABILITY
    // -------------------------
    private async isAvailable(): Promise<boolean> {
        if (IS_EXPO_GO) {
            logger.warn("[StepService] Expo Go detected → using fake steps");
            return true;
        }

        if (this.isAvailableOnDevice !== null) {
            return this.isAvailableOnDevice;
        }

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

            if (existing === "granted") {
                logger.log("[StepService] Permission already granted");
                return true;
            }

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
        logger.log("[StepService] Starting...");

        if (IS_EXPO_GO) {
            logger.warn("[StepService] Using fake step service");

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
    // STOP
    // -------------------------
    async stop(): Promise<void> {
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
