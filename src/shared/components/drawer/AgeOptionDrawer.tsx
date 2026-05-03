import { RowView } from "@/shared/components/CustomView";
import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { cn } from "@/shared/utils/cn";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MIN_AGE = 10;
const MAX_AGE = 80;
const DEFAULT_AGE = 12;
const AGES = Array.from(
    { length: MAX_AGE - MIN_AGE + 1 },
    (_, i) => MIN_AGE + i,
);

interface Props {
    value: number | null;
    onChange: (age: number) => void;
}

export type AgeOptionDrawerHandle = DrawerHandle;
const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2); // 2 — centers the selected item

const AgeOptionDrawer = forwardRef<DrawerHandle, Props>(
    ({ value, onChange }, ref) => {
        const drawerRef = useRef<DrawerHandle>(null);

        useImperativeHandle(ref, () => ({
            open: () => drawerRef.current?.open(),
            close: () => drawerRef.current?.close(),
        }));
        const initialIndex = value
            ? Math.max(0, AGES.indexOf(value))
            : DEFAULT_AGE;

        const scrollY = useRef(
            new Animated.Value(initialIndex * ITEM_HEIGHT),
        ).current;
        const scrollRef = useRef<any>(null);
        const [selectedIndex, setSelectedIndex] = useState(initialIndex);

        // scroll to initial value when drawer opens
        const handleLayout = () => {
            scrollRef.current?.scrollTo({
                y: initialIndex * ITEM_HEIGHT,
                animated: false,
            });
        };

        const handleMomentumEnd = (
            e: NativeSyntheticEvent<NativeScrollEvent>,
        ) => {
            const y = e.nativeEvent.contentOffset.y;
            const index = Math.round(y / ITEM_HEIGHT);
            const clamped = Math.max(0, Math.min(index, AGES.length - 1));
            setSelectedIndex(clamped);
            onChange(AGES[clamped]);
        };

        // tap to select
        const handleTap = (index: number) => {
            setSelectedIndex(index);
            scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
            });
            onChange(AGES[index]);
        };

        return (
            <Drawer ref={drawerRef}>
                <View className="p-4 px-0">
                    <RowView className="px-4 justify-center">
                        <Text className="text-base font-medium">
                            Choose Your Age
                        </Text>
                    </RowView>
                    <Animated.ScrollView
                        ref={scrollRef}
                        decelerationRate="fast"
                        showsVerticalScrollIndicator={false}
                        snapToInterval={ITEM_HEIGHT}
                        scrollEventThrottle={16}
                        onLayout={handleLayout}
                        onMomentumScrollEnd={handleMomentumEnd}
                        contentContainerStyle={{
                            paddingTop: ITEM_HEIGHT * PADDING_ITEMS,
                            paddingBottom: ITEM_HEIGHT * PADDING_ITEMS,
                        }}
                        style={{ height: PICKER_HEIGHT }}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: { y: scrollY },
                                    },
                                },
                            ],
                            {
                                useNativeDriver: true,
                                listener: () => {
                                    // if (!hasScrolled) setHasScrolled(true);
                                },
                            },
                        )}
                    >
                        {AGES.map((age, i) => {
                            const isSelected = i === selectedIndex; // ✅ fixed
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => handleTap(i)} // ✅ tap to select
                                    className={cn(
                                        "p-4 px-8 justify-center",
                                        isSelected && "bg-muted",
                                    )}
                                    style={{ height: ITEM_HEIGHT }}
                                >
                                    <RowView className="justify-center">
                                        <Text
                                            className={cn(
                                                "text-lg",
                                                isSelected && "text-primary",
                                            )}
                                        >
                                            {age}
                                        </Text>
                                    </RowView>
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.ScrollView>
                </View>
            </Drawer>
        );
    },
);

export default AgeOptionDrawer;
