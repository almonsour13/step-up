import { useOnboarding } from "@/shared/hooks/use-onboarding";
import { Redirect } from "expo-router";

export default function Index() {
    const { isOnboarded, isLoading } = useOnboarding();

    if (isLoading) return null;

    if (!isOnboarded) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(main)" />;
}
