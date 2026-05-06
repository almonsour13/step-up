import { ColView, RowView } from "@/shared/components/CustomView";
import Text from "@/shared/components/ui/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export default function SettingsHeader() {
    const navigation = useNavigation();
    return (
        <ColView className="px-4 pb-4 pt-8 justify-center">
            <RowView className="items-center gap-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        className="text-foreground"
                    />
                </TouchableOpacity>
                <Text className="text-xl font-medium text-foreground">
                    Settings
                </Text>
            </RowView>
        </ColView>
    );
}
