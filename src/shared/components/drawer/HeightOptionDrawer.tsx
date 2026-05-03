import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { cn } from "@/shared/utils/cn";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 220;
const HEIGHTS = Array.from(
    { length: MAX_HEIGHT - MIN_HEIGHT + 1 },
    (_, i) => MIN_HEIGHT + i,
);

const cmToFt = (cm: number) => {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { ft, inches };
};

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

type Unit = "cm" | "ft";

interface Props {
    value: number | null; // always stored in cm
    onChange: (height: number) => void;
}

export type HeightOptionDrawerHandle = DrawerHandle;

const HeightOptionDrawer = forwardRef<DrawerHandle, Props>(
    ({ value, onChange }, ref) => {
        const drawerRef = useRef<DrawerHandle>(null);
        const listRef = useRef<FlatList>(null);
        const [unit, setUnit] = useState<Unit>("cm");

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
        }));

        const initialIndex = value ? Math.max(0, HEIGHTS.indexOf(value)) : 0;

        const handleLayout = () => {
            listRef.current?.scrollToIndex({
                index: initialIndex,
                animated: false,
                viewPosition: 0.5,
            });
        };

        const getItemLayout = (_: any, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        });

        const renderItem = ({ item: cm }: { item: number }) => {
            const isSelected = value === cm;
            const { ft, inches } = cmToFt(cm);

            return (
                <TouchableOpacity
                    onPress={() => {
                        onChange(cm);
                        drawerRef.current?.close();
                    }}
                    className={cn(
                        "p-4 px-8 h-16 justify-center",
                        isSelected && "bg-muted",
                    )}
                >
                    <RowView className="justify-center items-baseline gap-2">
                        {unit === "cm" ? (
                            <Text
                                className={cn(
                                    "text-lg text-foreground",
                                    isSelected && "text-primary text-xl",
                                )}
                            >
                                {cm}{" "}
                                <Text className="text-base text-muted-foreground">
                                    cm
                                </Text>
                            </Text>
                        ) : (
                            <Text
                                className={cn(
                                    "text-lg text-foreground",
                                    isSelected && "text-primary text-xl",
                                )}
                            >
                                {ft}
                                <Text className="text-base text-muted-foreground">
                                    ft{" "}
                                </Text>
                                {inches}
                                <Text className="text-base text-muted-foreground">
                                    in
                                </Text>
                            </Text>
                        )}
                    </RowView>
                </TouchableOpacity>
            );
        };

        return (
            <Drawer ref={drawerRef} disableScrollView={true}>
                <View className="p-4 px-0">
                    <ColView className="gap-4">
                        {/* Header + unit toggle */}
                        <RowView className="px-4 justify-between items-center">
                            <Text className="text-base font-medium text-foreground">
                                Select Your Height
                            </Text>
                            <RowView className="bg-muted rounded-full p-1 gap-0">
                                {(["cm", "ft"] as Unit[]).map((u) => (
                                    <TouchableOpacity
                                        key={u}
                                        onPress={() => setUnit(u)}
                                        className={cn(
                                            "px-3 py-1 rounded-full",
                                            unit === u && "bg-foreground",
                                        )}
                                    >
                                        <Text
                                            className={cn(
                                                "text-xs font-medium text-muted-foreground",
                                                unit === u && "text-background",
                                            )}
                                        >
                                            {u}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </RowView>
                        </RowView>

                        <FlatList
                            ref={listRef}
                            data={HEIGHTS}
                            keyExtractor={(item) => String(item)}
                            renderItem={renderItem}
                            getItemLayout={getItemLayout}
                            onLayout={handleLayout}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            showsVerticalScrollIndicator={false}
                            extraData={unit}
                            contentContainerStyle={{
                                paddingTop: ITEM_HEIGHT * PADDING_ITEMS,
                                paddingBottom: ITEM_HEIGHT * PADDING_ITEMS,
                            }}
                            style={{ height: PICKER_HEIGHT }}
                            initialScrollIndex={initialIndex}
                            windowSize={5}
                            maxToRenderPerBatch={10}
                            removeClippedSubviews
                        />
                    </ColView>
                </View>
            </Drawer>
        );
    },
);

export default HeightOptionDrawer;
