import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

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
            <Text className="text-sm text-muted-foreground px-1">Profile</Text>
            <Card className="p-0">
                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <RowView className="items-center justify-between p-4 ">
                        <RowView className="gap-4">
                            <View className="w-12 h-12 rounded-full bg-foreground items-center justify-center">
                                <Text className="text-sm font-medium text-background">
                                    {initials}
                                </Text>
                            </View>
                            <ColView className=" gap-0.5">
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
                        <MaterialIcons
                            name="chevron-right"
                            size={18}
                            className="text-muted-foreground"
                        />
                    </RowView>
                </TouchableOpacity>
            </Card>
        </ColView>
    );
}
