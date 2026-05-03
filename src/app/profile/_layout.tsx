import { Tabs } from "expo-router";

export default function ProfileLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // Tabs handles slide direction automatically
                // based on tab index order
                animation: "none",
                sceneStyle: {
                    backgroundColor: "transparent",
                },
            }}
            tabBar={() => null} // hide default tab bar — you use MainNavigation
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="edit" />
        </Tabs>
    );
}
