import { ColView, RowView } from "@/shared/components/CustomView";
import AgeOptionDrawer from "@/shared/components/drawer/AgeOptionDrawer";
import GenderOptionDrawer from "@/shared/components/drawer/GenderOptionDrawer";
import HeightOptionDrawer from "@/shared/components/drawer/HeightOptionDrawer";
import WeightOptionDrawer from "@/shared/components/drawer/WeightOptionDrawer";
import Card from "@/shared/components/ui/Card";
import { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { profileService } from "@/shared/services/storage/profile.services";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { Gender } from "@/shared/types/type";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

export function EditProfileScreen() {
    const navigation = useNavigation();
    const profile = useProfileStore((s) => s.profile);
    const updateProfile = useProfileStore((s) => s.updateProfile);
    const [newProfile, setNewProfile] = useState(profile);

    const ageDrawerRef = useRef<DrawerHandle>(null);
    const genderDrawerRef = useRef<DrawerHandle>(null);
    const weightDrawerRef = useRef<DrawerHandle>(null);
    const heightDrawerRef = useRef<DrawerHandle>(null);

    const handleSave = async () => {
        if (!newProfile) return;

        const updatedProfile = await profileService.save({
            name: newProfile.name,
            age: newProfile.age,
            gender: newProfile.gender,
            weight: newProfile.weight,
            height: newProfile.height,
        });
        if (!updatedProfile) return;
        updateProfile(updatedProfile);
        ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
        navigation.goBack();
    };
    const Rows = {
        row1: [
            {
                Label: "Age",
                value: newProfile?.age,
                onPress: () => ageDrawerRef.current?.open(),
            },
            {
                Label: "Gender",
                value: newProfile?.gender && capitalize(newProfile.gender),
                onPress: () => genderDrawerRef.current?.open(),
            },
        ],
        row2: [
            {
                Label: "Weight",
                value: newProfile?.weight && newProfile?.weight + " kg",
                onPress: () => weightDrawerRef.current?.open(),
            },
            {
                Label: "Height",
                value: newProfile?.height && newProfile?.height + " cm",
                onPress: () => heightDrawerRef.current?.open(),
            },
        ],
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
        <>
            <ColView className="flex-1 gap-4">
                {/* header */}
                <ColView className="px-4 pt-8 justify-center">
                    <RowView className="justify-between">
                        <RowView className="items-center gap-4">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
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
                        {Rows.row1.map((row) => (
                            <ColView key={row.Label} className="flex-1">
                                <Text className="text-base text-muted-foreground font-medium">
                                    {row.Label}
                                </Text>
                                <TouchableOpacity onPress={() => row.onPress()}>
                                    <Card className="py-2 h-16 justify-center">
                                        <Text
                                            className={cn(
                                                "text-foreground",
                                                !row?.value &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            {row.value || "Select"}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </ColView>
                        ))}
                    </RowView>
                    <RowView className="px-4">
                        {Rows.row2.map((row) => (
                            <ColView key={row.Label} className="flex-1">
                                <Text className="text-base text-muted-foreground font-medium">
                                    {row.Label}
                                </Text>
                                <TouchableOpacity onPress={() => row.onPress()}>
                                    <Card className="py-2 h-16 justify-center">
                                        <Text
                                            className={cn(
                                                "text-foreground",
                                                !row?.value &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            {row.value || "Select"}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </ColView>
                        ))}
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
            <AgeOptionDrawer
                ref={ageDrawerRef}
                value={newProfile?.age || null}
                onChange={(age: number) => {
                    setNewProfile((prev) => ({
                        ...prev!,
                        age,
                    }));
                }}
            />
            <GenderOptionDrawer
                ref={genderDrawerRef}
                value={newProfile?.gender || null}
                onChange={(gender: Gender) => {
                    setNewProfile((prev) => ({
                        ...prev!,
                        gender,
                    }));
                }}
            />
            <WeightOptionDrawer
                ref={weightDrawerRef}
                value={newProfile?.weight || null}
                onChange={(weight) => {
                    setNewProfile((prev) => ({
                        ...prev!,
                        weight,
                    }));
                }}
            />
            <HeightOptionDrawer
                ref={heightDrawerRef}
                value={newProfile?.height || null}
                onChange={(height) => {
                    setNewProfile((prev) => ({
                        ...prev!,
                        height,
                    }));
                }}
            />
        </>
    );
}
