import { useActivityState } from "@/features/activity/hooks/use-activity-state";
import { useActivityHistory } from "@/features/history/hooks/use-activity-history";
import { useRecentActivity } from "@/features/home/hooks/use-recent-activity";
import { useTodayActivity } from "@/features/home/hooks/use-today-activity";

interface Props {
    children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
    useActivityState();
    useTodayActivity();
    useRecentActivity();
    useActivityHistory();
    return <>{children}</>;
}
