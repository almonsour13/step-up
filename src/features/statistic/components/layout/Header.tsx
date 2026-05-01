import { ColView } from "@/shared/components/CustomView";
import { Text } from "react-native";

export default function Header() {
    return (
        <ColView className="px-4 pt-12 gap-0.5">
            <Text className="text-2xl font-medium text-foreground">
                Statistics
            </Text>
            <Text className="text-sm text-muted-foreground">
                Track your progress over time
            </Text>
        </ColView>
    );
}
