import { Activity } from "@/shared/types/type";
import { STORAGE_KEYS, StorageService } from "./storage.service";

class ActivityStorage {
    private activitiesStore = new StorageService<Activity[]>(
        STORAGE_KEYS.activities,
    );

    async getAll(): Promise<Activity[]> {
        const activities = (await this.activitiesStore.get()) ?? [];

        return activities.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    async save(activity: Activity): Promise<void> {
        const activities = await this.getAll();
        activities.push(activity);

        await this.activitiesStore.set(activities);
    }

    async getById(id: string): Promise<Activity | undefined> {
        const activities = await this.getAll();
        return activities.find((a) => a.id === id);
    }
    async getToday(): Promise<Activity[]> {
        const activities = await this.getAll();

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        return activities.filter((activity) => {
            const createdAt = new Date(activity.createdAt);
            return createdAt >= startOfToday && createdAt <= endOfToday;
        });
    }
    async getThisWeek(): Promise<Activity[]> {
        const activities = await this.getAll();

        const today = new Date();
        const current = new Date(today);

        // Get Monday (start of week)
        const day = current.getDay(); // 0 = Sunday
        const diff = day === 0 ? -6 : 1 - day;

        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // End of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return activities.filter((activity) => {
            const createdAt = new Date(activity.createdAt);
            return createdAt >= startOfWeek && createdAt <= endOfWeek;
        });
    }
    async getRecentByDays(days: number = 7): Promise<Activity[]> {
        const activities = await this.getAll();

        const now = new Date();
        const past = new Date();
        past.setDate(now.getDate() - days);

        return activities
            .filter((a) => {
                const createdAt = new Date(a.createdAt);
                return createdAt >= past && createdAt <= now;
            })
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
    }

    async delete(id: string): Promise<void> {
        const activities = await this.getAll();
        const filtered = activities.filter((a) => a.id !== id);

        await this.activitiesStore.set(filtered);
    }

    async clear(): Promise<void> {
        await this.activitiesStore.remove();
    }
}

export const activityStorageService = new ActivityStorage();
