import { ColView } from "@/shared/components/CustomView";
import Text from "@/shared/components/ui/Text";
// finish screen
export default function Screen() {
    return (
        <ColView className="flex-1 gap-12">
            <ColView className="px-4 justify-center gap-4">
                <Text className="text-4xl font-semibold">
                    You're ready{"\n"}to go!
                </Text>
                <Text className="text-base text-muted-foreground leading-relaxed">
                    Your profile is set up. Start tracking your steps and hit
                    your first goal today.
                </Text>
            </ColView>
        </ColView>
    );
}
