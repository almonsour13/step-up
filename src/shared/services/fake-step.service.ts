// fake-step.service.ts
import { logger } from "../utils/logger";

export type StepUpdateCallback = (steps: number) => void;
class FakeStepService {
    private fakeInterval: ReturnType<typeof setInterval> | null = null;
    private fakeSteps: number = 0;
    private callbacks: StepUpdateCallback[] = [];

    async start(): Promise<void> {
        logger.info("[FakeStepService] Starting...");

        if (this.fakeInterval) {
            logger.warn("[FakeStepService] Already running");
            return;
        }
        // FIX: reset steps on every fresh start
        this.fakeSteps = 0;

        this.fakeInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 40) + 1;
            this.fakeSteps += increment;
            logger.info("[FakeStepService] Steps updated:", this.fakeSteps);
            this.callbacks.forEach((cb) => cb(this.fakeSteps));
        }, 1000);
    }

    // FIX: pause stops the interval but preserves fakeSteps
    // fake-step.service.ts

    async pause(): Promise<void> {
        logger.info("[FakeStepService] Pausing...");

        if (!this.fakeInterval) {
            logger.warn("[FakeStepService] Already paused");
            return;
        }

        // Stop ticking but DO NOT reset fakeSteps
        clearInterval(this.fakeInterval);
        this.fakeInterval = null;

        logger.info("[FakeStepService] Paused at", this.fakeSteps, "steps");
    }

    async resume(): Promise<void> {
        logger.info("[FakeStepService] Resuming...");

        if (this.fakeInterval) {
            logger.warn("[FakeStepService] Already running");
            return;
        }

        // Restart interval — fakeSteps continues from where it left off
        this.fakeInterval = setInterval(() => {
            const increment = Math.floor(Math.random() * 40) + 1;
            this.fakeSteps += increment; // accumulates on top of paused value
            logger.info("[FakeStepService] Steps updated:", this.fakeSteps);
            this.callbacks.forEach((cb) => cb(this.fakeSteps));
        }, 1000);

        logger.info("[FakeStepService] Resumed from", this.fakeSteps, "steps");
    }
    async stop(): Promise<void> {
        logger.info("[FakeStepService] Stopping...");

        if (this.fakeInterval) {
            clearInterval(this.fakeInterval);
            this.fakeInterval = null;
        } else {
            logger.warn("[FakeStepService] Already stopped");
        }
        // FIX: reset steps on every fresh start
        this.fakeSteps = 0;
    }

    onStepUpdate(callback: StepUpdateCallback): () => void {
        logger.info("[FakeStepService] Subscriber added");
        this.callbacks.push(callback);

        return () => {
            logger.info("[FakeStepService] Subscriber removed");
            this.callbacks = this.callbacks.filter((cb) => cb !== callback);
        };
    }

    getCurrentSteps(): number {
        return this.fakeSteps;
    }

    reset(): void {
        logger.info("[FakeStepService] Resetting steps to 0");
        this.fakeSteps = 0;
    }
}

export const fakeStepService = new FakeStepService();
