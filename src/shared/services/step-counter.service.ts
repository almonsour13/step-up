import Constants from "expo-constants";
import { Pedometer } from "expo-sensors";

export type StepUpdateCallback = (steps: number) => void;

const IS_EXPO_GO = Constants.appOwnership === "expo";

class StepCounterService {
    private isAvailableOnDevice: boolean | null = null;
    private isCounting: boolean = false;
    private isPaused: boolean = false;
    private subscription: { remove: () => void } | null = null;
    private updateCallbacks: StepUpdateCallback[] = [];

    private stepsAtPause: number = 0;
    private currentSteps: number = 0;

    private fakeInterval: ReturnType<typeof setInterval> | null = null;
    private fakeStepsDelta: number = 0;

    // ─── Private: Permissions & Availability ───────────────────────────────

    private async isAvailable(): Promise<boolean> {
        if (IS_EXPO_GO) return true;
        if (this.isAvailableOnDevice !== null) return this.isAvailableOnDevice;

        try {
            const available = await Pedometer.isAvailableAsync();
            this.isAvailableOnDevice = available;

            if (!available) {
                console.warn("Pedometer not available on this device");
            }

            return available;
        } catch (error) {
            console.error("Error checking pedometer availability:", error);
            this.isAvailableOnDevice = false;
            return false;
        }
    }

    private async requestPermissions(): Promise<boolean> {
        if (IS_EXPO_GO) return true;

        try {
            const { status: existing } = await Pedometer.getPermissionsAsync();
            if (existing === "granted") return true;

            const { status } = await Pedometer.requestPermissionsAsync();
            if (status !== "granted") {
                console.warn("Pedometer permission denied");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error requesting pedometer permissions:", error);
            return false;
        }
    }

    // ─── Private: Step Handling ────────────────────────────────────────────

    private handleStepUpdate(newSteps: number): void {
        if (!this.isCounting || this.isPaused) return;

        this.currentSteps = this.stepsAtPause + newSteps;

        console.log(`Step update: ${this.currentSteps} total steps`);
        this.notifySubscribers(this.currentSteps);
    }

    private notifySubscribers(steps: number): void {
        for (const cb of this.updateCallbacks) {
            try {
                cb(steps);
            } catch (error) {
                console.error("Error in step update callback:", error);
            }
        }
    }

    // ─── Private: Sensor Subscription ──────────────────────────────────────

    private startSensor(): void {
        if (IS_EXPO_GO) {
            console.warn("Expo Go detected — using simulated steps");
            this.startFakeSteps();
            return;
        }

        try {
            this.subscription = Pedometer.watchStepCount((result) => {
                console.log("Raw pedometer event:", result.steps);
                this.handleStepUpdate(result.steps);
            });
        } catch (error) {
            this.isCounting = false;
            console.error("Error starting step counting:", error);
        }
    }

    private stopSensor(): void {
        if (IS_EXPO_GO) {
            this.stopFakeSteps();
            return;
        }

        this.removeSubscription();
    }

    private removeSubscription(): void {
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
    }

    // ─── Private: Fake Steps (Expo Go) ─────────────────────────────────────

    private startFakeSteps(): void {
        this.fakeStepsDelta = 0;

        this.fakeInterval = setInterval(() => {
            this.fakeStepsDelta += Math.floor(Math.random() * 3) + 1;
            console.log("Fake pedometer event:", this.fakeStepsDelta);
            this.handleStepUpdate(this.fakeStepsDelta);
        }, 800);
    }

    private stopFakeSteps(): void {
        if (this.fakeInterval) {
            clearInterval(this.fakeInterval);
            this.fakeInterval = null;
        }
    }

    // ─── Public API ────────────────────────────────────────────────────────

    async start(initialSteps = 0): Promise<void> {
        if (this.isCounting) {
            console.warn("Step counting already started");
            return;
        }

        const permitted = await this.requestPermissions();
        if (!permitted) return;

        const available = await this.isAvailable();
        if (!available) {
            console.warn("Cannot start step counting: pedometer not available");
            return;
        }

        this.currentSteps = initialSteps;
        this.stepsAtPause = initialSteps;
        this.fakeStepsDelta = 0;
        this.isPaused = false;
        this.isCounting = true;

        console.log(
            `Step counting started with initial steps: ${initialSteps}`,
        );

        this.startSensor();
    }

    async stop(): Promise<number> {
        if (!this.isCounting) {
            return this.currentSteps;
        }

        try {
            this.stopSensor();

            const final = this.currentSteps;

            this.isCounting = false;
            this.isPaused = false;
            this.currentSteps = 0;
            this.stepsAtPause = 0;

            console.log(`Step counting stopped. Total steps: ${final}`);
            return final;
        } catch (error) {
            console.error("Error stopping step counting:", error);
            throw error;
        }
    }

    pause(): void {
        if (!this.isCounting || this.isPaused) return;

        this.stepsAtPause = this.currentSteps;
        this.isPaused = true;

        this.stopSensor();

        console.log(`Step counting paused at ${this.stepsAtPause} steps`);
    }

    resume(): void {
        if (!this.isCounting || !this.isPaused) return;

        this.isPaused = false;

        if (IS_EXPO_GO) {
            this.fakeStepsDelta = 0;
        }

        this.startSensor();

        console.log(
            `Step counting resumed. Steps before pause: ${this.stepsAtPause}`,
        );
    }

    onStepUpdate(callback: StepUpdateCallback): () => void {
        this.updateCallbacks.push(callback);

        return () => {
            this.updateCallbacks = this.updateCallbacks.filter(
                (cb) => cb !== callback,
            );
        };
    }
}

export const stepCounterService = new StepCounterService();
