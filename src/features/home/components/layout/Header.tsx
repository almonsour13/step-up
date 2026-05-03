import { ColView, RowView } from "@/shared/components/CustomView";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text } from "react-native";

const PHRASES = {
    morning: [
        "Time to lace up! 👟",
        "A great run starts now.",
        "Make today's miles count.",
        "Your best run is ahead of you.",
        "Rise and run! 🌅",
    ],
    noon: [
        "Still time for a great run!",
        "Afternoon miles hit different. 🔥",
        "Push through — you've got this.",
        "Mid-day energy? Use it.",
        "Your legs are ready. Are you?",
    ],
    evening: [
        "End the day strong. 💪",
        "One more run before you rest.",
        "Evening miles are earned miles.",
        "Finish the day on your feet.",
        "The night run is calling. 🌙",
    ],
};

export default function Header() {
    const router = useRouter();
    const profile = useProfileStore((s) => s.profile);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "morning" : hour < 17 ? "noon" : "evening";

    const randomPhrase = useMemo(() => {
        const pool = PHRASES[greeting];
        return pool[Math.floor(Math.random() * pool.length)];
    }, [greeting]);
    return (
        <RowView className="px-4 pt-12 justify-between items-start">
            <ColView className="gap-1">
                <Text className="text-sm text-muted-foreground">
                    Good {greeting}, {profile?.name.split(" ")[0]}
                </Text>
                <Text className="text-xl text-foreground leading-snug">
                    {randomPhrase}
                </Text>
            </ColView>
        </RowView>
    );
}
