import { ColView, RowView } from "@/shared/components/CustomView";
import Card from "@/shared/components/ui/Card";
import { profileService } from "@/shared/services/storage/profile.storage.services";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileScreen() {
    const router = useRouter();
    const profile = useProfileStore((s) => s.profile);
    const updateProfile = useProfileStore((s) => s.updateProfile);
    const [newProfile, setNewProfile] = useState(profile);

    const handleSave = async () => {
        if (!newProfile) return;

        const updatedProfile = await profileService.updateProfile({
            name: newProfile.name,
            age: newProfile.age,
            gender: newProfile.gender,
            weight: newProfile.weight,
            height: newProfile.height,
        });
        updateProfile(updatedProfile);
        ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
        router.back();
    };
    const initials =
        profile?.name
            .trim()
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "?";

    const isDirty =
        newProfile?.name?.trim() !== profile?.name?.trim() ||
        newProfile?.age !== profile?.age ||
        newProfile?.gender !== profile?.gender ||
        newProfile?.weight !== profile?.weight ||
        newProfile?.height !== profile?.height;

    const isValid =
        !!newProfile?.name?.trim() &&
        !!newProfile?.age &&
        !!newProfile?.gender &&
        !!newProfile?.weight &&
        !!newProfile?.height;

    const canSave = isDirty && isValid;

    return (
        <ColView className="flex-1 gap-4">
            {/* header */}
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
                            Edit Profile
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
            <RowView className="px-4 justify-center">
                <ColView className="items-center">
                    <View className="h-40 aspect-square bg-card rounded-full justify-center items-center">
                        <Text className="text-5xl font-medium text-primary">
                            {initials}
                        </Text>
                    </View>
                    <Text className="text-xs text-muted-foreground text-center">
                        Avatar generated from your initials
                    </Text>
                </ColView>
            </RowView>
            <ColView className="gap-4 flex-1">
                <ColView className="px-4">
                    <Text className="text-base text-muted-foreground font-medium">
                        Name
                    </Text>
                    <Card className="py-2 h-16 ">
                        <TextInput
                            className=""
                            placeholder="John Doe"
                            value={newProfile?.name}
                            onChangeText={(text) =>
                                setNewProfile((prev) => ({
                                    ...prev!,
                                    name: text,
                                }))
                            }
                        />
                    </Card>
                </ColView>
                <RowView className="px-4">
                    <ColView className="flex-1">
                        <Text className="text-base text-muted-foreground font-medium">
                            Age
                        </Text>
                        <Card className="py-2 h-16 justify-center">
                            <Text
                                className={cn(
                                    "text-foreground",
                                    !newProfile?.age && "text-muted-foreground",
                                )}
                            >
                                {newProfile?.age || "Select"}
                            </Text>
                        </Card>
                    </ColView>
                    <ColView className="flex-1">
                        <Text className="text-base text-muted-foreground font-medium">
                            Gender
                        </Text>
                        <Card className="py-2 h-16 justify-center">
                            <Text
                                className={cn(
                                    "text-foreground",
                                    !newProfile?.gender &&
                                        "text-muted-foreground",
                                )}
                            >
                                {newProfile?.gender || "Select"}
                            </Text>
                        </Card>
                    </ColView>
                </RowView>
                <RowView className="px-4">
                    <ColView className="flex-1">
                        <Text className="text-base text-muted-foreground font-medium">
                            Weight
                        </Text>
                        <Card className="py-2 h-16 justify-center">
                            <Text
                                className={cn(
                                    "text-foreground",
                                    !newProfile?.weight &&
                                        "text-muted-foreground",
                                )}
                            >
                                {newProfile?.weight
                                    ? `${newProfile.height} kg`
                                    : "Select"}
                            </Text>
                        </Card>
                    </ColView>
                    <ColView className="flex-1">
                        <Text className="text-base text-muted-foreground font-medium">
                            Height
                        </Text>
                        <Card className="py-2 h-16 justify-center">
                            <Text
                                className={cn(
                                    "text-foreground",
                                    !newProfile?.height &&
                                        "text-muted-foreground",
                                )}
                            >
                                {newProfile?.height
                                    ? `${newProfile.height} cm`
                                    : "Select"}
                            </Text>
                        </Card>
                    </ColView>
                </RowView>
            </ColView>
            <RowView className="px-4 mb-8 items-end">
                <TouchableOpacity
                    disabled={!canSave}
                    className={cn(
                        "h-16 p-4 flex-1 rounded-full justify-center items-center bg-primary",
                        !canSave && "opacity-50",
                    )}
                    onPress={handleSave}
                >
                    <Text className="text-foreground">Save</Text>
                </TouchableOpacity>
            </RowView>
        </ColView>
    );
}
