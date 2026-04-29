export type StepUpdateCallback = (steps: number) => void;

class StepCounterService {
    private isAvailableOnDevice: boolean | null = null;
    private isCounting: boolean = false;
    private subscription: { remove: () => void } | null = null;
    private sessionStartSteps: number = 0;
    private currentSteps: number = 0;
    private updateCallbacks: StepUpdateCallback[] = [];

    async isAvailable(): Promise<boolean> {
        if (this.isAvailableOnDevice !== null) {
            return this.isAvailableOnDevice;
        }
        return true;
    }
    async start(): Promise<void> {
        if (this.isCounting) {
            console.warn("Step counting already started");
            return;
        }

        const available = await this.isAvailable();
        if (!available) {
            console.warn("Cannot start step counting: pedometer not available");
            return;
        }
        try {
            const now = new Date();
            const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
            );
        } catch (error) {
            console.error("Error starting step counting:", error);
            // Don't throw - just continue without step counting
            console.log("Continuing without step counting");
        }
    }
    async stop(): Promise<number> {
        if (!this.isCounting) {
            return this.currentSteps;
        }
        try {
            if (this.subscription) {
                this.subscription.remove();
                this.subscription = null;
            }

            const finalSteps = this.currentSteps;

            this.isCounting = false;
            this.sessionStartSteps = 0;
            this.currentSteps = 0;

            console.log(`Step counting stopped. Total steps: ${finalSteps}`);

            return finalSteps;
        } catch (error) {
            console.error("Error stopping step counting:", error);
            throw error;
        }
    }
    pause(): void {
        if (!this.isCounting) {
            return;
        }

        // We don't actually stop the subscription, just stop processing updates
        // The pedometer continues counting in the background
        console.log("Step counting paused");
    }

    /**
     * Resume step counting
     */
    resume(): void {
        if (!this.isCounting) {
            return;
        }

        console.log("Step counting resumed");
    }
    onStepUpdate(callback: StepUpdateCallback): () => void {
        this.updateCallbacks.push(callback);

        // Return unsubscribe function
        return () => {
            this.updateCallbacks = this.updateCallbacks.filter(
                (cb) => cb !== callback,
            );
        };
    }
}

export const stepCounterService = new StepCounterService();
