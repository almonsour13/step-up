import { Activity } from "@/shared/types/type";
import { STORAGE_KEYS, StorageService } from "./storage.service";

class ActivityStorage {
    private activitiesStore = new StorageService<Activity[]>(
        STORAGE_KEYS.activities,
    );

    async getAll(): Promise<Activity[]> {
        return (await this.activitiesStore.get()) ?? [];
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
