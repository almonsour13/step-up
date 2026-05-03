import * as Notification from "expo-notifications";
import { Pedometer } from "expo-sensors";

export const requestAllPermissions = async () => {
    await Pedometer.requestPermissionsAsync();
    await Notification.requestPermissionsAsync();
};
