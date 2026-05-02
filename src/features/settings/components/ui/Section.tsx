import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
export type SettingsSection = {
    title: string;
    items: {
        label: string;
        description: string;
        icon: IconName;
        value?: string | number; // allow both
        onPress?: () => void;
        type: string;
    }[];
};
export default function Section({ section }: { section: SettingsSection }) {
    return (
        <ColView className="px-4 gap-1.5">
            <Text className="text-sm text-muted-foreground px-1">
                {section.title}
            </Text>
            <Card className="p-0 overflow-hidden">
                {section.items.map((item, i) => (
                    <TouchableOpacity key={item.label} onPress={item.onPress}>
                        <RowView
                            className={cn(
                                "justify-between items-center px-4 h-20",
                                i < section.items.length - 1
                                    ? "border-b border-border"
                                    : "",
                            )}
                        >
                            <RowView className="gap-4 items-center flex-1">
                                <View
                                    className={cn(
                                        "w-10 h-10 rounded-full items-center justify-center",
                                        item.type === "danger"
                                            ? "bg-red-500/10"
                                            : "bg-muted",
                                    )}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={18}
                                        color={
                                            item.type === "danger"
                                                ? "#ef4444"
                                                : undefined
                                        }
                                        className={
                                            item.type !== "danger"
                                                ? "text-foreground"
                                                : ""
                                        }
                                    />
                                </View>
                                <ColView className="gap-0 flex-1">
                                    <Text
                                        className={cn(
                                            "text-sm font-normal",
                                            item.type === "danger"
                                                ? "text-red-500"
                                                : "text-foreground",
                                        )}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.description && (
                                        <Text className="text-[11px] text-muted-foreground">
                                            {item.description}
                                        </Text>
                                    )}
                                </ColView>
                            </RowView>

                            <RowView className="items-center gap-1">
                                <Text className="text-sm text-muted-foreground">
                                    {item.value}
                                </Text>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={18}
                                    className="text-muted-foreground"
                                />
                            </RowView>
                        </RowView>
                    </TouchableOpacity>
                ))}
            </Card>
        </ColView>
    );
}
