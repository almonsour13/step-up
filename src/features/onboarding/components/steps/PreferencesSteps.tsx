import { ColView, RowView } from "@/shared/components/CustomView";
import StepGoalDrawer from "@/shared/components/drawer/StepGoalDrawer";
import UnitsDrawer from "@/shared/components/drawer/UnitsDrawer";
import Card from "@/shared/components/ui/Card";
import { DrawerHandle } from "@/shared/components/ui/Drawer";
import Text from "@/shared/components/ui/Text";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { cn } from "@/shared/utils/cn";
import { useRef } from "react";
import { Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
export default function PreferencesSteps() {
    const settings = useSettingsStore((s) => s.settings);

    const unitsDrawerRef = useRef<DrawerHandle>(null);
    const stepGoalDrawerRef = useRef<DrawerHandle>(null);

    const Rows = [
        {
            Label: "Units",
            value: settings.units,
            onPress: () => unitsDrawerRef.current?.open(),
        },
        {
            Label: "StepGoal",
            value: settings.stepGoal,
            onPress: () => stepGoalDrawerRef.current?.open(),
        },
    ];
    return (
        <>
            <ColView className="flex-1 gap-12" style={{ width }}>
                <ColView className="px-4 justify-center gap-4">
                    <Text className="text-4xl font-semibold">
                        Customize your{"\n"}experience
                    </Text>
                    <Text className="text-base text-muted-foreground leading-relaxed">
                        Set your daily step goal and preferred units so
                        everything feels just right.
                    </Text>
                </ColView>

                <ColView className="gap-4 flex-1">
                    <RowView className="px-4 gap-4">
                        {Rows.map((row) => (
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
            <StepGoalDrawer ref={stepGoalDrawerRef} />
            <UnitsDrawer ref={unitsDrawerRef} />
        </>
    );
}
