import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import Text from "@/shared/components/ui/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

type PermissionStatus = "idle" | "granted" | "denied";

type Permission = {
    key: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    required: boolean;
    check: () => Promise<PermissionStatus>;
    request: () => Promise<boolean>;
};

export default function OnBoardingPermissionScreen() {
    const [statuses, setStatuses] = useState<Record<string, PermissionStatus>>({
        pedometer: "idle",
        notifications: "idle",
    });

    const setStatus = (key: string, status: PermissionStatus) =>
        setStatuses((prev) => ({ ...prev, [key]: status }));

    const permissions: Permission[] = [
        {
            key: "pedometer",
            icon: "footsteps-outline",
            title: "Motion & Fitness",
            description: "Required to count your steps and track activity.",
            required: true,
            check: async () => {
                const available = await Pedometer.isAvailableAsync();
                if (!available) return "denied";
                const { status } = await Pedometer.getPermissionsAsync();
                if (status === "granted") return "granted";
                if (status === "denied") return "denied";
                return "idle";
            },
            request: async () => {
                const available = await Pedometer.isAvailableAsync();
                if (!available) {
                    Alert.alert(
                        "Not Available",
                        "Step tracking is not supported on this device.",
                    );
                    return false;
                }
                const { status } = await Pedometer.requestPermissionsAsync();
                return status === "granted";
            },
        },
        {
            key: "notifications",
            icon: "notifications-outline",
            title: "Notifications",
            description:
                "Get reminders to move and celebrate when you hit your goal.",
            required: false,
            check: async () => {
                const { status } = await Notifications.getPermissionsAsync();
                if (status === "granted") return "granted";
                if (status === "denied") return "denied";
                return "idle";
            },
            request: async () => {
                const { status } =
                    await Notifications.requestPermissionsAsync();
                return status === "granted";
            },
        },
    ];

    // check existing permission status on mount
    useEffect(() => {
        permissions.forEach(async (p) => {
            const status = await p.check();
            setStatus(p.key, status);
        });
    }, []);

    const handleRequest = async (permission: Permission) => {
        const current = statuses[permission.key];
        if (current === "granted") return;
        // if already denied by OS, show settings hint
        if (current === "denied") {
            Alert.alert(
                "Permission Denied",
                `Please enable ${permission.title} in your device Settings to continue.`,
            );
            return;
        }
        const granted = await permission.request();
        setStatus(permission.key, granted ? "granted" : "denied");
    };

    return (
        <>
            <ColView className="flex-1 gap-12">
                <ColView className="px-4 justify-center gap-4">
                    <Text className="text-4xl font-semibold">
                        Allow access{"\n"}to get started
                    </Text>
                    <Text className="text-base text-muted-foreground leading-relaxed">
                        We need a couple of permissions to track your steps and
                        keep you motivated.
                    </Text>
                </ColView>

                <ColView className="gap-4 flex-1">
                    <ColView className="px-4 gap-4">
                        {permissions.map((p) => {
                            const status = statuses[p.key];
                            const isGranted = status === "granted";
                            const isDenied = status === "denied";

                            return (
                                <TouchableOpacity
                                    key={p.key}
                                    onPress={() => handleRequest(p)}
                                    disabled={isGranted}
                                    activeOpacity={isGranted ? 1 : 0.7}
                                >
                                    <Card>
                                        <RowView className="items-center gap-8">
                                            <ColView className="flex-1">
                                                <RowView className="items-center">
                                                    <Text className="font-medium">
                                                        {p.title}
                                                    </Text>
                                                    {p.required && (
                                                        <Text className="text-xs text-primary">
                                                            Required
                                                        </Text>
                                                    )}
                                                </RowView>
                                                <Text className="text-xs text-muted-foreground">
                                                    {p.description}
                                                </Text>
                                            </ColView>
                                            <View>
                                                <Ionicons
                                                    name={
                                                        isGranted
                                                            ? "checkmark-circle"
                                                            : isDenied
                                                              ? "close-circle-outline"
                                                              : "ellipse-outline"
                                                    }
                                                    size={20}
                                                    className={
                                                        isGranted
                                                            ? "text-green-500"
                                                            : isDenied
                                                              ? "text-red-500"
                                                              : "text-muted-foreground"
                                                    }
                                                />
                                            </View>
                                        </RowView>
                                    </Card>
                                </TouchableOpacity>
                            );
                        })}
                    </ColView>
                </ColView>
            </ColView>
        </>
    );
}
