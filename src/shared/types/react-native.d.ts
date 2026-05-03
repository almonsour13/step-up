import "react-native";

declare module "react-native" {
    interface TextProps {
        defaultProps?: TextProps;
    }
    namespace Text {
        let defaultProps: TextProps | undefined;
    }
}
