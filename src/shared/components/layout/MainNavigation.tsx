import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import { Href, usePathname, useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { ColView, RowView } from "../CustomView";
import Card from "../ui/Card";
import Text from "../ui/Text";

function MainNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const menus: {
        label: string;
        href: Href;
        icon: keyof typeof Ionicons.glyphMap;
        active?: boolean;
    }[] = [
        {
            label: "Home",
            href: "/",
            icon: "home",
            active: true,
        },
        {
            label: "History",
            href: "/history",
            icon: "time",
        },
        {
            label: "Activity",
            href: "/activity",
            icon: "footsteps",
        },
        {
            label: "Settings",
            href: "../settings",
            icon: "settings",
        },
    ];
    const isItemActive = (href: Href) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href.toString());
    };
    const HIDE_ON_THIS_ROUTE = ["/run"];
    if (HIDE_ON_THIS_ROUTE.includes(pathname)) return null;

    return (
        <Card className="px-4 h-20 bg-card rounded-b-none">
            <RowView className="flex-1 justify-between items-center">
                {menus.map((menu, index) => {
                    const isActive = isItemActive(menu.href);

                    return (
                        <Pressable
                            key={menu.label}
                            onPress={() => router.push(menu.href)}
                            disabled={isActive}
                            className="flex-1"
                        >
                            <ColView className="gap-2 min-h-12 justify-center items-center">
                                <Ionicons
                                    name={menu.icon}
                                    size={24}
                                    className={clsx(
                                        "text-muted-foreground",
                                        isActive && "text-primary",
                                    )}
                                />
                                <View
                                    className={clsx(
                                        "h-2 aspect-square rounded-full bg-primary",
                                        !isActive && "hidden",
                                    )}
                                />
                                <Text
                                    className={clsx(
                                        "hidden text-xs text-muted-foreground",
                                        isActive && "text-primary",
                                    )}
                                >
                                    {menu.label}
                                </Text>
                            </ColView>
                        </Pressable>
                    );
                })}
            </RowView>
        </Card>
    );
}

export default memo(MainNavigation);
