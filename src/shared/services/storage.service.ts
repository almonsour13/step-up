import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
    activeActivity: "@active_activity",
    activities: "@activities",
};

export class StorageService<T> {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    async get(): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(this.key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (error) {
            console.error(`Error getting ${this.key}:`, error);
            return null;
        }
    }

    async set(data: T): Promise<void> {
        try {
            await AsyncStorage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error setting ${this.key}:`, error);
        }
    }

    async remove(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.key);
        } catch (error) {
            console.error(`Error removing ${this.key}:`, error);
        }
    }

    async update(partial: Partial<T>): Promise<void> {
        try {
            const current = await this.get();

            if (!current) {
                await this.set(partial as T);
                return;
            }

            const updated = {
                ...(current as object),
                ...partial,
            };

            await this.set(updated as T);
        } catch (error) {
            console.error(`Error updating ${this.key}:`, error);
        }
    }
}
