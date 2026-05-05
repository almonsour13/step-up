import { ColView, RowView } from "@/shared/components/CustomView";
import AgeOptionDrawer from "@/shared/components/drawer/AgeOptionDrawer";
import GenderOptionDrawer from "@/shared/components/drawer/GenderOptionDrawer";
import HeightOptionDrawer from "@/shared/components/drawer/HeightOptionDrawer";
import WeightOptionDrawer from "@/shared/components/drawer/WeightOptionDrawer";
import Card from "@/shared/components/ui/Card";
import { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { useProfileStore } from "@/shared/stores/use-profile.store";
import { Gender } from "@/shared/types/type";
import { capitalize } from "@/shared/utils/capitalize";
import { cn } from "@/shared/utils/cn";
import { useRef } from "react";
import { TextInput, TouchableOpacity } from "react-native";

export default function OnBoardingProfileScreen() {
    const profile = useProfileStore((s) => s.profile);
    const setProfile = useProfileStore((s) => s.setProfile);
    const updateProfile = useProfileStore((s) => s.updateProfile);

    const ageDrawerRef = useRef<DrawerHandle>(null);
    const genderDrawerRef = useRef<DrawerHandle>(null);
    const weightDrawerRef = useRef<DrawerHandle>(null);
    const heightDrawerRef = useRef<DrawerHandle>(null);

    const Rows = {
        row1: [
            {
                Label: "Age",
                value: profile?.age,
                onPress: () => ageDrawerRef.current?.open(),
            },
            {
                Label: "Gender",
                value: profile?.gender && capitalize(profile.gender),
                onPress: () => genderDrawerRef.current?.open(),
            },
        ],
        row2: [
            {
                Label: "Weight",
                value: profile?.weight && profile?.weight + " kg",
                onPress: () => weightDrawerRef.current?.open(),
            },
            {
                Label: "Height",
                value: profile?.height && profile?.height + " cm",
                onPress: () => heightDrawerRef.current?.open(),
            },
        ],
    };

    return (
        <>
            <ColView className="flex-1 gap-12">
                <ColView className="px-4 justify-center gap-4">
                    <Text className="text-4xl font-semibold">
                        Tell us about{"\n"}yourself
                    </Text>
                    <Text className="text-base text-muted-foreground leading-relaxed">
                        We'll use this to calculate your calories and distance,
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
                                value={profile?.name}
                                onChangeText={(name) => updateProfile({ name })}
                            />
                        </Card>
                    </ColView>

                    <RowView className="px-4 gap-4">
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
                    <RowView className="px-4 gap-4">
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
            </ColView>

            <AgeOptionDrawer
                ref={ageDrawerRef}
                value={profile?.age ?? null}
                onChange={(age) => updateProfile({ age })}
            />
            <GenderOptionDrawer
                ref={genderDrawerRef}
                value={profile?.gender ?? null}
                onChange={(gender: Gender | null) =>
                    updateProfile({ gender: gender ?? undefined })
                }
            />
            <WeightOptionDrawer
                ref={weightDrawerRef}
                value={profile?.weight ?? null}
                onChange={(weight) => updateProfile({ weight })}
            />
            <HeightOptionDrawer
                ref={heightDrawerRef}
                value={profile?.height ?? null}
                onChange={(height) => updateProfile({ height })}
            />
        </>
    );
}
