import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { cn } from "../../utils/cn";
import { ColView, RowView } from "../CustomView";
import Drawer, { DrawerHandle } from "../ui/Drawer";
import DeleteActionDrawer, {
    DeleteActionDrawerHandle,
} from "./DeleteActionDrawer";

const CARD_ACTIONS = [{ label: "Delete", danger: true }];
export type ActivityCardActionDrawerHandle = DrawerHandle & {
    openWithActivityId: (id: string) => void;
};
const ActivityCardActionDrawer = forwardRef<
    ActivityCardActionDrawerHandle,
    {
        onClose?: () => void;
    }
>(({ onClose }, ref) => {
    const drawerRef = useRef<ActivityCardActionDrawerHandle>(null);
    const deleteDrawerRef = useRef<DeleteActionDrawerHandle>(null);
    const [activityId, setActivityId] = useState("");

    useImperativeHandle(ref, () => ({
        open: () => drawerRef.current?.open(),
        close: () => drawerRef.current?.close(),
        openWithActivityId: (id: string) => {
            setActivityId(id);
            drawerRef.current?.open();
        },
    }));

    const handleAction = (label: string) => {
        switch (label) {
            case "Delete":
                deleteDrawerRef.current?.openWithActivityId(activityId);
                break;
        }

        drawerRef.current?.close();
    };

    return (
        <>
            <Drawer ref={drawerRef}>
                <ColView className="gap-0 pb-4">
                    {CARD_ACTIONS.map((action) => {
                        return (
                            <TouchableOpacity
                                key={action.label}
                                onPress={() => handleAction(action.label)}
                                className={cn("px-8 h-12 justify-center")}
                            >
                                <RowView className="justify-between">
                                    <Text
                                        className={cn(
                                            "text-lg",
                                            action.danger && "text-red-500",
                                        )}
                                    >
                                        {action.label}
                                    </Text>
                                </RowView>
                            </TouchableOpacity>
                        );
                    })}
                </ColView>
            </Drawer>
            <DeleteActionDrawer ref={deleteDrawerRef} onClose={onClose} />
        </>
    );
});

export default ActivityCardActionDrawer;
