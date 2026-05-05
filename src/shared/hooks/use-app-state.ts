// hooks/useAppState.ts
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { activeActivityService } from "../services/active-activity.service";
import { activityNotificationService } from "../services/notification/active-activity.notification.service";

let _initialized = false;
export function useAppState() {
    const appState = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener("change", async (nextState) => {
            const prev = appState.current;
            appState.current = nextState;

            const metrics = activeActivityService.getCurrentMetrics();

            if (!metrics || metrics.status !== "active") return;

            // App going to background or being closed
            if (
                prev === "active" &&
                (nextState === "background" || nextState === "inactive")
            ) {
                await activityNotificationService.show(
                    metrics.duration,
                    metrics.steps,
                );
            }

            // App coming back to foreground
            if (
                (prev === "background" || prev === "inactive") &&
                nextState === "active"
            ) {
                await activityNotificationService.dismiss();
            }
        });

        return () => sub.remove();
    }, []);
}
