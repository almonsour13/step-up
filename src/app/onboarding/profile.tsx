import { ColView, RowView } from "@/shared/components/CustomView";
import AgeOptionDrawer from "@/shared/components/drawer/AgeOptionDrawer";
import GenderOptionDrawer from "@/shared/components/drawer/GenderOptionDrawer";
import HeightOptionDrawer from "@/shared/components/drawer/HeightOptionDrawer";
import WeightOptionDrawer from "@/shared/components/drawer/WeightOptionDrawer";
import Card from "@/shared/components/ui/Card";
import { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { Gender } from "@/shared/types/type";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function Screen() {
    const router = useRouter();
    const [profile, setProfile] = useState<{
        name: string;
        age: number;
        gender: Gender | null;
        weight: number;
        height: number;
    }>({
        name: "",
        age: 0,
        gender: null,
        weight: 0,
        height: 0,
    });

    const ageDrawerRef = useRef<DrawerHandle>(null);
    const genderDrawerRef = useRef<DrawerHandle>(null);
    const weightDrawerRef = useRef<DrawerHandle>(null);
    const heightDrawerRef = useRef<DrawerHandle>(null);

    const Rows = {
        row1: [
            {
                Label: "Age",
                value: profile.age,
                onPress: () => ageDrawerRef.current?.open(),
            },
            {
                Label: "Gender",
                value: profile.gender && capitalize(profile.gender),
                onPress: () => genderDrawerRef.current?.open(),
            },
        ],
        row2: [
            {
                Label: "Weight",
                value: profile.weight,
                onPress: () => weightDrawerRef.current?.open(),
            },
            {
                Label: "Height",
                value: profile.height,
                onPress: () => heightDrawerRef.current?.open(),
            },
        ],
    };

    const isValid =
        !!profile?.name?.trim() &&
        !!profile?.age &&
        !!profile?.gender &&
        !!profile?.weight &&
        !!profile?.height;

    return (
        <>
            <ColView className="flex-1 gap-8">
                <ColView className="flex-1 gap-8">
                    <ColView className="px-4 pt-16 justify-center gap-4">
                        <Text className="text-4xl font-semibold">
                            Set Your Profile
                        </Text>
                        <Text className="text-base text-muted-foreground leading-relaxed">
                            Your personal step tracker. Build healthy habits and
                            reach your daily goals.
                        </Text>
                    </ColView>

                    <ColView className="gap-4 flex-1">
                        <ColView className="px-4">
                            <Text className="text-base text-muted-foreground font-medium">
                                Name
                            </Text>
                            <Card className="py-2 h-16 ">
                                <TextInput
                                    className=""
                                    placeholder="Type your name"
                                    value={profile.name}
                                />
                            </Card>
                        </ColView>

                        <RowView className="px-4 gap-4">
                            {Rows.row1.map((row) => (
                                <ColView key={row.Label} className="flex-1">
                                    <Text className="text-base text-muted-foreground font-medium">
                                        {row.Label}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => row.onPress()}
                                    >
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
                        <RowView className="px-4 gap-4">
                            {Rows.row2.map((row) => (
                                <ColView key={row.Label} className="flex-1">
                                    <Text className="text-base text-muted-foreground font-medium">
                                        {row.Label}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => row.onPress()}
                                    >
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
                </ColView>
                <View className="px-4 pb-16">
                    <TouchableOpacity
                        disabled={!isValid}
                        className={cn(
                            "h-16 rounded-full justify-center items-center bg-primary ",
                            !isValid && "opacity-50",
                        )}
                    >
                        <Text className="text-white font-medium">Next</Text>
                    </TouchableOpacity>
                </View>
            </ColView>

            <AgeOptionDrawer
                ref={ageDrawerRef}
                value={profile?.age || null}
                onChange={(age: number) => {
                    setProfile((prev) => ({
                        ...prev!,
                        age,
                    }));
                }}
            />
            <GenderOptionDrawer
                ref={genderDrawerRef}
                value={profile?.gender || null}
                onChange={(gender: Gender | null) => {
                    setProfile((prev) => ({
                        ...prev!,
                        gender,
                    }));
                }}
            />
            <WeightOptionDrawer
                ref={weightDrawerRef}
                value={profile?.weight || null}
                onChange={(weight) => {
                    setProfile((prev) => ({
                        ...prev!,
                        weight,
                    }));
                }}
            />
            <HeightOptionDrawer
                ref={heightDrawerRef}
                value={profile?.height || null}
                onChange={(height) => {
                    setProfile((prev) => ({
                        ...prev!,
                        height,
                    }));
                }}
            />
        </>
    );
}
