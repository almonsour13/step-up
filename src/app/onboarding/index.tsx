import { ColView } from "@/shared/components/CustomView";
import Text from "@/shared/components/ui/Text";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function Screen() {
    const router = useRouter();
    return (
        <ColView className="flex-1 gap-8">
            <ColView className="flex-1 justify-end">
                <ColView className="px-4 justify-center items-center gap-4">
                    <Text className="text-4xl font-semibold">
                        Count Every Steps
                    </Text>
                    <Text className="text-base text-muted-foreground text-center leading-relaxed">
                        Your personal step tracker. Build healthy habits and
                        reach your daily goals.
                    </Text>
                </ColView>
            </ColView>
            <View className="px-4 pb-16">
                <TouchableOpacity
                    onPress={() => router.push("/onboarding/profile")}
                    className="h-16 rounded-full justify-center items-center bg-primary "
                >
                    <Text className="text-white font-medium">Get Started</Text>
                </TouchableOpacity>
            </View>
        </ColView>
    );
}
