import { STORAGE_KEYS } from "@/shared/constants/constant";
import { generateActivities } from "@/shared/lib/data";
import { Activity, ActivityFilters } from "@/shared/types/type";
import { logger } from "@/shared/utils/logger";
import { StorageService } from "./storage.service";

class ActivityService {
    private activitiesStore = new StorageService(STORAGE_KEYS.ACTIVITIES);

    private cachedActivities: Activity[] | null = null;

    private getGeneratedActivities(): Activity[] {
        if (!this.cachedActivities) {
            this.cachedActivities = generateActivities({
                months: 24,
            });
        }
        return this.cachedActivities;
    }
    async get(): Promise<Activity[]> {
        try {
            const activities = this.getGeneratedActivities();
            return activities;
        } catch (error) {
            logger.error("[ActivityStorage] get → error:", error);
            throw error;
        }
    }
    async getAll(filters?: ActivityFilters): Promise<{
        activities: Activity[];
        hasMore: boolean;
    }> {
        logger.log("[ActivityStorage] getAll → start");

        const page = filters?.page ?? 1;
        const dayLimit = filters?.dayLimit;
        const limit = filters?.limit;
        const period = filters?.period;

        try {
            const activities = await this.get();
            const today = new Date();

            const filtered = activities
                .filter((a) => {
                    const createdAt = new Date(a.createdAt);

                    if (period === "week") {
                        const start = new Date(today);
                        start.setDate(today.getDate() - 7);
                        return createdAt >= start && createdAt <= today;
                    }

                    if (period === "month") {
                        const start = new Date(today);
                        start.setMonth(today.getMonth() - 1);
                        return createdAt >= start && createdAt <= today;
                    }

                    if (period === "all" && dayLimit) {
                        const start = new Date(today);
                        start.setDate(today.getDate() - dayLimit * page);
                        const end = new Date(today);
                        end.setDate(today.getDate() - dayLimit * (page - 1));
                        return createdAt >= start && createdAt <= end;
                    }

                    return true;
                })
                .sort((a, b) => {
                    if (filters?.sort === "oldest") {
                        return (
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        );
                    }
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });

            // limit applied last — always gets most recent N
            const result = limit ? filtered.slice(0, limit) : filtered;

            // hasMore — check if there are activities beyond current page/limit
            const hasMore =
                period === "all" && dayLimit
                    ? activities.some((a) => {
                          const createdAt = new Date(a.createdAt);
                          const end = new Date(today);
                          end.setDate(today.getDate() - dayLimit * page);
                          return createdAt < end;
                      })
                    : limit
                      ? filtered.length > result.length
                      : false;

            logger.log("[ActivityStorage] getAll → count:", result.length);
            return { activities: result, hasMore };
        } catch (error) {
            logger.error("[ActivityStorage] getAll → error:", error);
            throw error;
        }
    }
    async getById(id: string): Promise<Activity | null> {
        logger.log("[ActivityStorage] getById → id:", id);

        try {
            const activities = await this.get();
            const activity = activities.find((a) => a.id === id);

            logger.log(
                "[ActivityStorage] getById → result:",
                activity ? "FOUND" : "NULL",
            );

            return activity || null;
        } catch (error) {
            logger.error("[ActivityStorage] getById → error:", error);
            throw error;
        }
    }
    async getByDate(date: string): Promise<Activity[]> {
        logger.log("[ActivityStorage] getByDate → date:", date);

        try {
            const dateObj = new Date(date);
            const activities = await this.get();
            const filtered = activities.filter((a) => {
                const createdAt = new Date(a.createdAt);
                return createdAt.toDateString() === dateObj.toDateString();
            });

            logger.log("[ActivityStorage] getByDate → count:", filtered.length);

            return filtered;
        } catch (error) {
            logger.error("[ActivityStorage] getByDate → error:", error);
            throw error;
        }
    }
    async update(id: string, updates: Partial<Activity>): Promise<void> {
        logger.log("[ActivityStorage] update → id:", id);
        logger.log("[ActivityStorage] update → fields:", Object.keys(updates));

        try {
            const activities = await this.get();
            const index = activities.findIndex((a) => a.id === id);
            if (index === -1) {
                logger.warn("[ActivityStorage] update → activity not found");
                return;
            }
            const updated = {
                ...activities[index],
                ...updates,
            };
            activities[index] = updated;

            this.cachedActivities = activities;

            // await this.activitiesStore.set(activities);

            logger.log("[ActivityStorage] update → success");
        } catch (error) {
            logger.error("[ActivityStorage] update → error:", error);
            throw error;
        }
    }
    async save(activity: Activity): Promise<void> {
        logger.log("[ActivityStorage] save → start", {
            id: activity.id,
        });

        try {
            const activities = await this.get();
            activities.push(activity);

            await this.activitiesStore.set(activities);

            logger.log("[ActivityStorage] save → success");
        } catch (error) {
            logger.error("[ActivityStorage] save → error:", error);
            throw error;
        }
    }
    async delete(id: string): Promise<void> {
        logger.warn("[ActivityStorage] delete → id:", id);

        try {
            const activities = await this.get();
            const filtered = activities.filter((a) => a.id !== id);

            this.cachedActivities = filtered;

            // await this.activitiesStore.set(filtered);

            logger.log("[ActivityStorage] delete → success");
        } catch (error) {
            logger.error("[ActivityStorage] delete → error:", error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        logger.warn("[ActivityStorage] clear → removing all activities");

        try {
            this.cachedActivities = null;

            // await this.activitiesStore.remove();

            logger.log("[ActivityStorage] clear → success");
        } catch (error) {
            logger.error("[ActivityStorage] clear → error:", error);
            throw error;
        }
    }
}

export const activityService = new ActivityService();
