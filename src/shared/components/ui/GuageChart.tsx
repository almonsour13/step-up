import Svg, { Circle, G, Line, Text as SvgText } from "react-native-svg";

type StrokeLinecap = "butt" | "round" | "square";
type ZoneMode = "none" | "traffic" | "custom";

interface Zone {
    from: number; // 0-100
    to: number; // 0-100
    color: string;
}

interface GaugeChartProps {
    pct: number;
    radius?: number;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    trackColor?: string;
    color?: string;
    gapDeg?: number;
    startDeg?: number; // rotation offset from 12 o'clock
    showNeedle?: boolean;
    showValue?: boolean;
    showLabels?: boolean;
    zoneMode?: ZoneMode;
    customZones?: Zone[];
    valueFormatter?: (pct: number) => string;
    labelColor?: string;
    valueColor?: string;
    needleColor?: string;
}

const TRAFFIC_ZONES: Zone[] = [
    { from: 0, to: 33, color: "#E24B4A" },
    { from: 33, to: 66, color: "#EF9F27" },
    { from: 66, to: 100, color: "#639922" },
];

function polarToXY(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number,
): [number, number] {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export default function GaugeChart({
    pct,
    radius = 80,
    strokeWidth = 14,
    strokeLinecap = "round",
    trackColor = "#e5e7eb",
    color = "#378ADD",
    gapDeg = 30,
    startDeg = 0,
    showNeedle = true,
    showValue = true,
    showLabels = true,
    zoneMode = "none",
    customZones,
    valueFormatter = (v) => `${v}%`,
    labelColor = "#888780",
    valueColor = "#2C2C2A",
    needleColor = "#2C2C2A",
}: GaugeChartProps) {
    const CENTER = radius + strokeWidth + 20; // extra padding for labels
    const SIZE = CENTER * 2;

    // The gauge arc:
    //   starts at (180 + gapDeg) degrees and ends at (360 - gapDeg)
    //   measured from 12 o'clock (SVG 0° = 3 o'clock, our 0° = 12 o'clock)
    // Total span = 180 - 2 * gapDeg degrees
    const arcSpanDeg = 180 - 2 * gapDeg;
    const arcStartDeg = 180 + gapDeg + startDeg; // left end of gauge arc
    const arcEndDeg = 360 - gapDeg + startDeg; // right end of gauge arc

    const toAngle = (fraction: number) => arcStartDeg + fraction * arcSpanDeg;

    // Circumference for dash trick
    const CIRCUMFERENCE = 2 * Math.PI * radius;

    // Helper: render a partial arc as a Circle with strokeDasharray
    // We rotate the group so arc starts at arcStartDeg
    // The strokeDasharray trick: dash = arc length, gap = rest of circumference
    // rotation origin is CENTER, CENTER
    // SVG circle starts at 3 o'clock (90° offset applied via group rotation)

    // Effective rotation: normalize circle start (3 o'clock = 90°) to 12 o'clock (-90°),
    // then add arcStartDeg
    const groupRotation = -90 + arcStartDeg;

    const arcLength = (span: number) => (span / 360) * CIRCUMFERENCE;
    const trackArcLength = arcLength(arcSpanDeg);
    const progressArcLength = arcLength((pct / 100) * arcSpanDeg);

    // Zones: split into segments
    const zones: Zone[] =
        zoneMode === "traffic"
            ? TRAFFIC_ZONES
            : zoneMode === "custom" && customZones
              ? customZones
              : [];

    // Needle
    const needleDeg = toAngle(pct / 100);
    const needleLength = radius - strokeWidth / 2 - 4;
    const [nx, ny] = polarToXY(CENTER, CENTER, needleLength, needleDeg);

    // Tick label positions (outer edge of arc)
    const labelR = radius + strokeWidth / 2 + 10;
    const [minX, minY] = polarToXY(CENTER, CENTER, labelR, arcStartDeg);
    const [midX, midY] = polarToXY(CENTER, CENTER, labelR, toAngle(0.5));
    const [maxX, maxY] = polarToXY(CENTER, CENTER, labelR, arcEndDeg);

    return (
        <Svg width={SIZE} height={SIZE}>
            {/* Track arc */}
            <G rotation={groupRotation} origin={`${CENTER}, ${CENTER}`}>
                <Circle
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="transparent"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${trackArcLength} ${CIRCUMFERENCE}`}
                    strokeLinecap={strokeLinecap}
                />
            </G>

            {/* Progress arc — solid color */}
            {zoneMode === "none" && pct > 0 && (
                <G rotation={groupRotation} origin={`${CENTER}, ${CENTER}`}>
                    <Circle
                        cx={CENTER}
                        cy={CENTER}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${progressArcLength} ${CIRCUMFERENCE}`}
                        strokeLinecap={strokeLinecap}
                    />
                </G>
            )}

            {/* Progress arc — zone segments */}
            {zoneMode !== "none" &&
                zones.map((zone, i) => {
                    const segStart = zone.from / 100;
                    const segEnd = Math.min(zone.to, pct) / 100;
                    if (segEnd <= segStart) return null;

                    const segSpanDeg = (segEnd - segStart) * arcSpanDeg;
                    const segOffsetDeg = segStart * arcSpanDeg;
                    const segArcLength = arcLength(segSpanDeg);
                    const segRotation = groupRotation + segOffsetDeg;

                    // Only the final segment gets the chosen linecap
                    const isLast = pct > zone.from && pct <= zone.to;
                    const cap: StrokeLinecap = isLast ? strokeLinecap : "butt";

                    return (
                        <G
                            key={i}
                            rotation={segRotation}
                            origin={`${CENTER}, ${CENTER}`}
                        >
                            <Circle
                                cx={CENTER}
                                cy={CENTER}
                                r={radius}
                                fill="transparent"
                                stroke={zone.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segArcLength} ${CIRCUMFERENCE}`}
                                strokeLinecap={cap}
                            />
                        </G>
                    );
                })}

            {/* Needle */}
            {showNeedle && (
                <>
                    <Line
                        x1={CENTER}
                        y1={CENTER}
                        x2={nx}
                        y2={ny}
                        stroke={needleColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        opacity={0.75}
                    />
                    <Circle
                        cx={CENTER}
                        cy={CENTER}
                        r={5}
                        fill={needleColor}
                        opacity={0.85}
                    />
                </>
            )}

            {/* Center value */}
            {showValue && (
                <SvgText
                    x={CENTER}
                    y={CENTER - 10}
                    textAnchor="middle"
                    fontSize={radius * 0.28}
                    fontWeight="500"
                    fill={valueColor}
                >
                    {valueFormatter(pct)}
                </SvgText>
            )}

            {/* Arc tick labels */}
            {showLabels && (
                <>
                    <SvgText
                        x={minX}
                        y={minY + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fill={labelColor}
                    >
                        0
                    </SvgText>
                    <SvgText
                        x={midX}
                        y={midY - 4}
                        textAnchor="middle"
                        fontSize={11}
                        fill={labelColor}
                    >
                        50
                    </SvgText>
                    <SvgText
                        x={maxX}
                        y={maxY + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fill={labelColor}
                    >
                        100
                    </SvgText>
                </>
            )}
        </Svg>
    );
}
