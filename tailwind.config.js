/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}", // ← add this
    ],
    presets: [require("nativewind/preset")],
    darkMode: "media",
    theme: {
        extend: {
            fontFamily: {
                sans: ["DMSans_400Regular"],
                medium: ["DMSans_500Medium"],
                semibold: ["DMSans_600SemiBold"],
                bold: ["DMSans_700Bold"],
            },
        },
    },
    plugins: [],
};
