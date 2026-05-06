import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import { memo } from "react";
import { Pressable, View } from "react-native";
import ActivityButton from "../ActivityButton";
import { ColView, RowView } from "../CustomView";
import Card from "../ui/Card";
import Text from "../ui/Text";

function MainTabBar({ state, navigation }: { state: any; navigation: any }) {
    const tabs = [
        {
            label: "Home",
            icon: "home",
            onPress: () => navigation.navigate("home" as never),
            visible: true,
        },
        {
            label: "Report",
            icon: "bar-chart",
            onPress: () => navigation.navigate("history" as never),
            visible: true,
        },
        {
            label: "History",
            icon: "time",
            onPress: () => navigation.navigate("history" as never),
            visible: true,
        },
        {
            label: "Settings",
            icon: "settings",
            onPress: () => navigation.navigate("settings" as never),
            visible: true,
        },
    ];

    return (
        <RowView className="absolute bottom-0 left-0 right-0 p-4 justify-between items-center">
            <Card className="h-20 rounded-full p-4 px-8 bg-card-foreground flex-1 justify-between">
                <RowView className="flex-1 gap-0 justify-between">
                    {tabs
                        .filter((tab) => tab.visible)
                        .map((tab, index) => {
                            const isActive = state.index === index;
                            return (
                                <Pressable
                                    key={tab.label}
                                    onPress={() => tab.onPress()}
                                    className="justify-center items-center"
                                >
                                    <ColView className="gap-2 min-h-12 justify-center items-center ">
                                        <Ionicons
                                            name={tab.icon as any}
                                            size={24}
                                            className={clsx(
                                                "text-muted-foreground",
                                                isActive && "text-primary",
                                            )}
                                        />
                                        <View
                                            className={clsx(
                                                "hidden h-2 aspect-square rounded-full bg-primary",
                                                !isActive && "hidden",
                                            )}
                                        />
                                        <Text
                                            className={clsx(
                                                "hidden text-xs text-muted-foreground",
                                                isActive && "text-primary",
                                            )}
                                        >
                                            {tab.label}
                                        </Text>
                                    </ColView>
                                </Pressable>
                            );
                        })}
                </RowView>
            </Card>
            <ActivityButton />
        </RowView>
    );
}

export default memo(MainTabBar);
