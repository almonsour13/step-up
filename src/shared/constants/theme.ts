export const theme = [];
// NativeWind vars() format
import { vars } from "nativewind";
const lightTheme = {
    "--background": "#FFFFFF",
    "--background-secondary": "#F8FAFC",
    "--background-muted": "#F1F5F9",
    "--foreground": "#1E293B",
    "--foreground-secondary": "#334155",
    "--foreground-muted": "#64748B",
    "--card": "#FFFFFF",
    "--card-foreground": "#1E293B",
    "--border": "#E2E8F0",
    "--input": "#F1F5F9",
    "--ring": "#3B82F6",
    "--primary": "#3B82F6",
    "--primary-foreground": "#FFFFFF",
};

const darkTheme = {
    "--background": "#0F172A",
    "--background-secondary": "#1E293B",
    "--background-muted": "#334155",
    "--foreground": "#F1F5F9",
    "--foreground-secondary": "#E2E8F0",
    "--foreground-muted": "#94A3B8",
    "--card": "#1E293B",
    "--card-foreground": "#F1F5F9",
    "--border": "#334155",
    "--input": "#334155",
    "--ring": "#60A5FA",
    "--primary": "#60A5FA",
    "--primary-foreground": "#1E293B",
};

export const themes = {
    light: vars(lightTheme),
    dark: vars(darkTheme),
};
