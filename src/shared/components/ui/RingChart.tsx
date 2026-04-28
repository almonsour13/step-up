import Svg, { Circle, G } from "react-native-svg";

type StrokeLinecap = "butt" | "round" | "square";

interface RingChartProps {
    pct: number;
    radius?: number;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    trackColor?: string;
    progressColor?: string;
}

export default function RingChart({
    pct,
    radius = 24,
    strokeWidth = 8,
    strokeLinecap = "round",
    trackColor = "#e5e7eb",
    progressColor = "#3b82f6",
}: RingChartProps) {
    const RADIUS = radius;
    const STROKE_WIDTH = strokeWidth;
    const CENTER = RADIUS + STROKE_WIDTH;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const SIZE = (RADIUS + STROKE_WIDTH) * 2;

    const dashLength = (pct / 100) * CIRCUMFERENCE;

    return (
        <Svg width={SIZE} height={SIZE}>
            <G rotation="-90" origin={`${CENTER}, ${CENTER}`}>
                {/* Background track */}
                <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="transparent"
                    stroke={trackColor}
                    strokeWidth={STROKE_WIDTH}
                />

                {/* Progress arc */}
                <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="transparent"
                    stroke={progressColor} // ✅ FIXED
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${dashLength} ${CIRCUMFERENCE}`}
                    strokeLinecap={strokeLinecap}
                />
            </G>
        </Svg>
    );
}
