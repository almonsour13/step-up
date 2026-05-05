import { useEffect, useState } from "react";
import { onboardingService } from "../services/storage/oboarding.service";

export const useOnboarding = () => {
    const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            const isComplete = await onboardingService.isComplete();
            setIsOnboarded(isComplete);
        };

        check();
    }, []);

    const isLoading = isOnboarded === null;

    return {
        isOnboarded,
        isLoading,
        isOnboarding: isOnboarded === false,
    };
};
