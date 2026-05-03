import { Text as RNText, TextProps } from "react-native";

export default function Text({ style, ...props }: TextProps) {
    return (
        <RNText
            style={[{ fontFamily: "DMSans_400Regular" }, style]}
            {...props}
        />
    );
}
