import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { capitalize } from "@/shared/utils/capitalize";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Screen() {
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

    const meta = [
        {
            Label: "Age",
            value: profile?.age,
        },
        {
            Label: "Gender",
            value: capitalize(profile?.gender || ""),
        },
        {
            Label: "Weight",
            value: profile?.weight + " kg",
        },
        {
            Label: "Height",
            value: profile?.height + " cm",
        },
    ];
    return (
        <ScrollView>
            <ColView className="gap-4">
                <ColView className="px-4 h-20 justify-center">
                    <RowView className="justify-between">
                        <RowView className="items-center gap-4">
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    className="text-foreground"
                                />
                            </TouchableOpacity>
                            <Text className="text-xl font-medium text-foreground">
                                Profile
                            </Text>
                        </RowView>
                        {profile?.updatedAt && (
                            <Text className="text-xs text-muted">
                                Last updated{" "}
                                {format(new Date(profile.updatedAt), "p")}
                            </Text>
                        )}
                    </RowView>
                </ColView>
                <ColView className="px-4 justify-center items-center">
                    <ColView className="items-center">
                        <View className="h-40 aspect-square bg-card rounded-full justify-center items-center">
                            <Text className="text-5xl font-medium text-primary">
                                {initials}
                            </Text>
                        </View>
                    </ColView>
                </ColView>
                <ColView className="px-4 gap-4 justify-center items-center">
                    <Text className="text-4xl font-medium">
                        {profile?.name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/profile/edit")}
                        className="h-12 px-4  flex-row gap-2 rounded-full justify-center items-center border border-border/40"
                    >
                        <Text className="text-white text-sm">
                            Edit Profile{" "}
                        </Text>
                        <Ionicons
                            name="pencil-outline"
                            size={12}
                            className="text-white"
                        />
                    </TouchableOpacity>
                </ColView>
                <ColView className="px-4">
                    <RowView>
                        {meta.map((m) => (
                            <Card key={m.Label} className="flex-1">
                                <ColView className="gap-1">
                                    <Text className="text-base text-foreground">
                                        {m.value}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground font-medium">
                                        {m.Label}
                                    </Text>
                                </ColView>
                            </Card>
                        ))}
                    </RowView>
                </ColView>
            </ColView>
        </ScrollView>
    );
}
