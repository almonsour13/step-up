import { RowView } from "@/shared/components/CustomView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

export default function ActivityController() {
    return (
        <RowView className="justify-center">
            <TouchableOpacity className="h-24 aspect-square rounded-full bg-primary justify-center items-center">
                <Ionicons name="play" size={28} />
            </TouchableOpacity>
        </RowView>
    );
}
