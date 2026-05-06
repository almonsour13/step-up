import { EditProfileScreen } from "@/features/profile";
import ProfileScreen from "@/features/profile/screens/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProfileStackParamList = {
    profile: undefined;
    editProfile: undefined; // or { userId: string } if needed
};
const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    contentStyle: {
                        backgroundColor: "transparent",
                    },
                }}
            >
                <Stack.Screen name="profile" component={ProfileScreen} />
                <Stack.Screen
                    name="editProfile"
                    component={EditProfileScreen}
                />
            </Stack.Navigator>
        </SafeAreaView>
    );
}
