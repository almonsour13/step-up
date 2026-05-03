import { ColView, RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { cn } from "@/shared/utils/cn";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Text from "../ui/Text";

const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;
const WEIGHTS = Array.from(
    { length: MAX_WEIGHT - MIN_WEIGHT + 1 },
    (_, i) => MIN_WEIGHT + i,
);

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

interface Props {
    value: number | null;
    onChange: (weight: number) => void;
}

export type WeightOptionDrawerHandle = DrawerHandle;

const WeightOptionDrawer = forwardRef<DrawerHandle, Props>(
    ({ value, onChange }, ref) => {
        const drawerRef = useRef<DrawerHandle>(null);
        const listRef = useRef<FlatList>(null);

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
        }));

        const initialIndex = value ? Math.max(0, WEIGHTS.indexOf(value)) : 0;

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

        const renderItem = ({ item: itemValue }: { item: number }) => {
            const isSelected = value === itemValue;
            return (
                <TouchableOpacity
                    onPress={() => {
                        onChange(itemValue);
                        drawerRef.current?.close();
                    }}
                    className={cn(
                        "p-4 px-8 h-16 justify-center",
                        isSelected && "bg-muted",
                    )}
                >
                    <RowView className="justify-center">
                        <Text
                            className={cn(
                                "text-lg",
                                isSelected && "text-primary text-xl",
                            )}
                        >
                            {itemValue}{" "}
                            <Text className="text-base text-muted-foreground">
                                kg
                            </Text>
                        </Text>
                    </RowView>
                </TouchableOpacity>
            );
        };

        return (
            <Drawer ref={drawerRef} disableScrollView={true}>
                <View className="p-4 px-0">
                    <ColView className="gap-4">
                        <RowView className="px-4 justify-center">
                            <Text className="text-base font-medium text-foreground">
                                Select Your Weight
                            </Text>
                        </RowView>
                        <FlatList
                            ref={listRef}
                            data={WEIGHTS}
                            keyExtractor={(item) => String(item)}
                            renderItem={renderItem}
                            getItemLayout={getItemLayout}
                            onLayout={handleLayout}
                            snapToInterval={ITEM_HEIGHT}
                            decelerationRate="fast"
                            showsVerticalScrollIndicator={false}
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

export default WeightOptionDrawer;
