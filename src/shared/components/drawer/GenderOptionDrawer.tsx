import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { GENDER_OPTIONS } from "@/shared/constants/constant";
import { Gender } from "@/shared/types/type";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MIN_AGE = 10;
const MAX_AGE = 80;
const DEFAULT_AGE = 12;
const AGES = Array.from(
    { length: MAX_AGE - MIN_AGE + 1 },
    (_, i) => MIN_AGE + i,
);

interface Props {
    value: Gender | null;
    onChange: (gender: Gender) => void;
}

const GenderOptionDrawer = forwardRef<DrawerHandle, Props>(
    ({ value, onChange }, ref) => {
        const drawerRef = useRef<DrawerHandle>(null);

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
        }));

        return (
            <Drawer ref={drawerRef}>
                <View className="p-4 px-0">
                    <RowView className="px-4 justify-center">
                        <Text className="text-base font-medium">
                            Choose Your Gender
                        </Text>
                    </RowView>

                    <ColView className="gap-0">
                        {GENDER_OPTIONS.map((gender) => {
                            const lowerCaseGender = gender.toLocaleLowerCase();
                            const isSelected = value === lowerCaseGender;
                            return (
                                <TouchableOpacity
                                    key={gender}
                                    onPress={() => {
                                        onChange(lowerCaseGender as Gender);
                                        drawerRef.current?.close();
                                    }}
                                    className={cn(
                                        "p-4 px-8 h-16 justify-center",
                                        isSelected && "bg-muted",
                                    )}
                                >
                                    <RowView className="justify-between">
                                        <Text
                                            className={cn(
                                                "text-lg",
                                                isSelected && "text-primary",
                                            )}
                                        >
                                            {gender}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons
                                                name="checkmark"
                                                size={20}
                                                className="text-primary"
                                            />
                                        )}
                                    </RowView>
                                </TouchableOpacity>
                            );
                        })}
                    </ColView>
                </View>
            </Drawer>
        );
    },
);

export default GenderOptionDrawer;
