import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileSection() {
    const router = useRouter();
    const profile = useProfileStore((s) => s.profile);

    const initials =
        profile?.name
            .trim()
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "?";

    return (
        <ColView className="px-4">
            <Card className="p-0 overflow-hidden">
                <TouchableOpacity onPress={() => router.push("/profile/edit")}>
                    <RowView className="items-center p-4 gap-4">
                        <View className="w-16 h-16 rounded-full bg-foreground items-center justify-center">
                            <Text className="text-sm font-medium text-background">
                                {initials}
                            </Text>
                        </View>
                        <ColView className="flex-1 gap-0.5">
                            <Text className="text-lg font-medium text-foreground">
                                {profile?.name ?? "—"}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                {profile
                                    ? `${profile.age} yrs · ${profile.height} cm · ${profile.weight} kg · ${profile.gender === "male" ? "Male" : "Female"}`
                                    : "No profile data"}
                            </Text>
                        </ColView>
                    </RowView>
                </TouchableOpacity>
            </Card>
        </ColView>
    );
}
