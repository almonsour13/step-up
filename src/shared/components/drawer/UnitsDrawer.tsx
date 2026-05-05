import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { UNIT_OPTIONS } from "@/shared/constants/constant";
import { useSettingsStore } from "@/shared/stores/use-settings.store";
import { Unit } from "@/shared/types/type";
import { cn } from "@/shared/utils/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { TouchableOpacity } from "react-native";
import Text from "../ui/Text";

interface Props {
    children?: React.ReactNode;
}

const UnitsDrawer = forwardRef<DrawerHandle, Props>((_, ref) => {
    const drawerRef = useRef<DrawerHandle>(null);
    const settings = useSettingsStore((s) => s.settings);
    const setUnits = useSettingsStore((s) => s.setUnits);
    useImperativeHandle(ref, () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
    }));

    return (
        <Drawer ref={drawerRef}>
            <ColView>
                {UNIT_OPTIONS.map((t) => {
                    const lowerT = t.toLowerCase() as Unit;
                    const isSelected = settings.units === lowerT;
                    return (
                        <TouchableOpacity
                            key={t}
                            onPress={() => {
                                setUnits(lowerT);
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
                                    {t.toLocaleString()}
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
        </Drawer>
    );
});

export default UnitsDrawer;
