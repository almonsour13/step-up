import { STORAGE_KEYS } from "@/shared/constants/constant";
import { Activity } from "@/shared/types/type";
import { logger } from "@/shared/utils/logger";
import { StorageService } from "./storage.service";

class ActivityStorage {
    private activitiesStore = new StorageService<Activity[]>(
        STORAGE_KEYS.ACTIVITIES,
    );

    async getAll(): Promise<Activity[]> {
        logger.log("[ActivityStorage] getAll → start");

        try {
            const activities = (await this.activitiesStore.get()) ?? [];

            logger.log("[ActivityStorage] getAll → count:", activities.length);

            return activities.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
        } catch (error) {
            logger.error("[ActivityStorage] getAll → error:", error);
            throw error;
        }
    }

    async save(activity: Activity): Promise<void> {
        logger.log("[ActivityStorage] save → start", {
            id: activity.id,
        });

        try {
            const activities = await this.getAll();
            activities.push(activity);

            await this.activitiesStore.set(activities);

            logger.log("[ActivityStorage] save → success");
        } catch (error) {
            logger.error("[ActivityStorage] save → error:", error);
            throw error;
        }
    }

    async getById(id: string): Promise<Activity | undefined> {
        logger.log("[ActivityStorage] getById → id:", id);

        try {
            const activities = await this.getAll();
            const found = activities.find((a) => a.id === id);

            logger.log(
                "[ActivityStorage] getById → result:",
                found ? "FOUND" : "NOT FOUND",
            );

            return found;
        } catch (error) {
            logger.error("[ActivityStorage] getById → error:", error);
            throw error;
        }
    }

    async getToday(): Promise<Activity[]> {
        logger.log("[ActivityStorage] getToday → start");

        try {
            const activities = await this.getAll();

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const result = activities.filter((activity) => {
                const createdAt = new Date(activity.createdAt);
                return createdAt >= start && createdAt <= end;
            });

            logger.log("[ActivityStorage] getToday → count:", result.length);

            return result;
        } catch (error) {
            logger.error("[ActivityStorage] getToday → error:", error);
            throw error;
        }
    }

    async getThisWeek(): Promise<Activity[]> {
        logger.log("[ActivityStorage] getThisWeek → start");

        try {
            const activities = await this.getAll();

            const today = new Date();
            const day = today.getDay();
            const diff = day === 0 ? -6 : 1 - day;

            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() + diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const result = activities.filter((activity) => {
                const createdAt = new Date(activity.createdAt);
                return createdAt >= startOfWeek && createdAt <= endOfWeek;
            });

            logger.log("[ActivityStorage] getThisWeek → count:", result.length);

            return result;
        } catch (error) {
            logger.error("[ActivityStorage] getThisWeek → error:", error);
            throw error;
        }
    }

    async getRecentByDays(days: number = 7): Promise<Activity[]> {
        logger.log("[ActivityStorage] getRecentByDays → days:", days);

        try {
            const activities = await this.getAll();

            const now = new Date();
            const past = new Date();
            past.setDate(now.getDate() - days);

            const result = activities
                .filter((a) => {
                    const createdAt = new Date(a.createdAt);
                    return createdAt >= past && createdAt <= now;
                })
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                );

            logger.log(
                "[ActivityStorage] getRecentByDays → count:",
                result.length,
            );

            return result;
        } catch (error) {
            logger.error("[ActivityStorage] getRecentByDays → error:", error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        logger.warn("[ActivityStorage] delete → id:", id);

        try {
            const activities = await this.getAll();
            const filtered = activities.filter((a) => a.id !== id);

            await this.activitiesStore.set(filtered);

            logger.log("[ActivityStorage] delete → success");
        } catch (error) {
            logger.error("[ActivityStorage] delete → error:", error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        logger.warn("[ActivityStorage] clear → removing all activities");

        try {
            await this.activitiesStore.remove();

            logger.log("[ActivityStorage] clear → success");
        } catch (error) {
            logger.error("[ActivityStorage] clear → error:", error);
            throw error;
        }
    }
}

export const activityStorageService = new ActivityStorage();
