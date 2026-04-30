import { useActivityStore } from "@/shared/stores/use-activity.store";

export const useActivityHistory = () => {
    return useActivityStore((s) => s.activities);
};
