import { activityService } from "@/shared/services/activity.service";
import { useEffect, useRef } from "react";
import { useActivityStore } from "../stores/use-activity.store";

export const useActivityState = () => {
    const status = useActivityStore((s) => s.status);
    const duration = useActivityStore((s) => s.duration);
    const setStatus = useActivityStore((s) => s.setStatus);
    const setDuration = useActivityStore((s) => s.setDuration);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pausedTimeRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);

    // Restore persisted activity on mount
    useEffect(() => {
        activityService.restore().then((activity) => {
            if (!activity) return;
            setStatus(activity.status);
            startTimeRef.current = activity.startTime;
            pausedTimeRef.current = activity.pausedTime;

            if (activity.status === "paused") {
                setDuration(activity.pausedTime);
            }
        });
    }, []);

    // Subscribe to metrics updates
    useEffect(() => {
        return activityService.onMetricsUpdate((m) => {
            // setDuration(m.duration);
        });
    }, []);

    // Manage interval based on status
    useEffect(() => {
        if (status === "active") {
            startTimeRef.current = Date.now() - pausedTimeRef.current;

            intervalRef.current = setInterval(() => {
                const newElapsed = Date.now() - startTimeRef.current!;
                setDuration(newElapsed);
            }, 1000);
        }

        if (status === "paused") {
            pausedTimeRef.current = duration;
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        if (status === "idle") {
            pausedTimeRef.current = 0;
            startTimeRef.current = null;
            setDuration(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status]);
};
