import Drawer, { DrawerHandle } from "@/shared/components/ui/Drawer";
import { activityService } from "@/shared/services/storage/activity.service";
import { useActivityStore } from "@/shared/stores/use-activity.store";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ToastAndroid, TouchableOpacity } from "react-native";
import { ColView, RowView } from "../CustomView";
import Text from "../ui/Text";
export type DeleteActionDrawerHandle = DrawerHandle & {
    openWithActivityId: (id: string) => void;
};
const DeleteActionDrawer = forwardRef<
    DeleteActionDrawerHandle,
    { onClose?: () => void }
>(({ onClose }, ref) => {
    const notifyUpdate = useActivityStore((s) => s.notifyUpdate);
    const deleteActivity = useActivityStore((s) => s.deleteActivity);
    const drawerRef = useRef<DrawerHandle>(null);
    const [activityId, setActivityId] = useState("");

    useImperativeHandle(ref, () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
        openWithActivityId: (id: string) => {
            setActivityId(id);
            drawerRef.current?.open();
        },
    }));

    const onDelete = () => {
        activityService.delete(activityId);
        deleteActivity(activityId);
        drawerRef.current?.close();
        ToastAndroid.show("Activity deleted", ToastAndroid.SHORT);
        onClose?.();
    };
    return (
        <Drawer ref={drawerRef}>
            <ColView className="gap-8 p-4">
                <ColView>
                    <Text className="text-center text-lg font-medium text-foreground">
                        Do you want to delete this activity? This action cannot
                        be undone
                    </Text>
                </ColView>
                <RowView className="justfi-between">
                    <TouchableOpacity
                        className="flex-1 h-16 rounded-full justify-center items-center bg-muted  "
                        onPress={() => drawerRef.current?.close()}
                    >
                        <Text className="text-base">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 h-16 rounded-full justify-center items-center bg-destructive  "
                        onPress={onDelete}
                    >
                        <Text className="text-base text-white">Delete</Text>
                    </TouchableOpacity>
                </RowView>
            </ColView>
        </Drawer>
    );
});

export default DeleteActionDrawer;
