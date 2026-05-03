import Constants from "expo-constants";
import { logger } from "../utils/logger";

export type StepUpdateCallback = (steps: number) => void;

const IS_EXPO_GO = Constants.appOwnership === "expo";

// ─── FakeStepService ────────────────────────────────────────────────────────

class FakeStepService {
    private fakeInterval: ReturnType<typeof setInterval> | null = null;
    private fakeSteps: number = 0;
    private callbacks: StepUpdateCallback[] = [];

    async start(): Promise<void> {
        logger.info("Starting fake step service...");

        if (this.fakeInterval) {
            logger.warn("Fake step service already running");
            return;
        }

        this.fakeSteps = 0;

        this.fakeInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 3) + 1;
            this.fakeSteps += increment;

            logger.info("Steps updated:", this.fakeSteps);

            this.callbacks.forEach((cb) => cb(this.fakeSteps));
        }, 1000);
    }

    async stop(): Promise<void> {
        logger.info("Stopping fake step service...");

        if (this.fakeInterval) {
            clearInterval(this.fakeInterval);
            this.fakeInterval = null;
        } else {
            logger.warn("Fake step service already stopped");
        }
    }

    onStepUpdate(callback: StepUpdateCallback): () => void {
        logger.info("Subscriber added");

        this.callbacks.push(callback);

        return () => {
            logger.info("Subscriber removed");
            this.callbacks = this.callbacks.filter((cb) => cb !== callback);
        };
    }

    getCurrentSteps(): number {
        return this.fakeSteps;
    }

    reset(): void {
        logger.info("Resetting steps to 0");
        this.fakeSteps = 0;
    }
}

export const fakeStepService = new FakeStepService();
