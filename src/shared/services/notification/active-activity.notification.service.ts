// services/activity-notification.service.ts
import { logger } from "@/shared/utils/logger";
import * as Notifications from "expo-notifications";

const ACTIVITY_NOTIFICATION_ID = "active-activity-timer";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: false,
    }),
});

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

class ActivityNotificationService {
    async requestPermissions(): Promise<boolean> {
        const { status: existing } = await Notifications.getPermissionsAsync();
        if (existing === "granted") return true;

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            logger.warn("[ActivityNotificationService] Permission denied");
            return false;
        }
        return true;
    }

    async show(durationMs: number, steps: number): Promise<void> {
        const granted = await this.requestPermissions();
        if (!granted) return;

        await Notifications.scheduleNotificationAsync({
            identifier: ACTIVITY_NOTIFICATION_ID,
            content: {
                title: "🏃 Activity in Progress",
                body: `⏱ ${formatDuration(durationMs)}   👟 ${steps} steps`,
                sticky: true,
                sound: false,
                data: { type: "active-activity" },
            },
            trigger: null,
        });
    }

    async update(durationMs: number, steps: number): Promise<void> {
        await this.show(durationMs, steps);
    }

    async dismiss(): Promise<void> {
        await Notifications.dismissNotificationAsync(ACTIVITY_NOTIFICATION_ID);
        await Notifications.cancelScheduledNotificationAsync(
            ACTIVITY_NOTIFICATION_ID,
        );
        logger.log("[ActivityNotificationService] Notification dismissed");
    }
}

export const activityNotificationService = new ActivityNotificationService();
