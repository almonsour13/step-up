import Svg, { G, Path } from "react-native-svg";

type Props = {
    width?: number;
    height?: number;
    color?: string;
    opacity?: number;
};

function Footprint({
    x,
    y,
    rotation = 0,
    scale = 1,
    color,
    opacity,
}: {
    x: number;
    y: number;
    rotation?: number;
    scale?: number;
    color: string;
    opacity: number;
}) {
    return (
        <G
            transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}
            opacity={opacity}
        >
            {/* Heel */}
            <Path
                d="M0,12 C-5,12 -8,8 -8,4 C-8,0 -5,-2 0,-2 C5,-2 8,0 8,4 C8,8 5,12 0,12Z"
                fill={color}
            />
            {/* Big toe */}
            <Path
                d="M-6,-4 C-8,-4 -9,-6 -8,-8 C-7,-10 -5,-10 -4,-8 C-3,-6 -4,-4 -6,-4Z"
                fill={color}
            />
            {/* Second toe */}
            <Path
                d="M-3,-5 C-5,-5 -6,-7 -5,-9 C-4,-11 -2,-11 -1,-9 C0,-7 -1,-5 -3,-5Z"
                fill={color}
            />
            {/* Middle toe */}
            <Path
                d="M0,-5 C-2,-5 -3,-7 -2,-9 C-1,-11 1,-11 2,-9 C3,-7 2,-5 0,-5Z"
                fill={color}
            />
            {/* Fourth toe */}
            <Path
                d="M3,-4 C1,-4 0,-6 1,-8 C2,-10 4,-10 5,-8 C6,-6 5,-4 3,-4Z"
                fill={color}
            />
            {/* Pinky toe */}
            <Path
                d="M6,-3 C4,-3 3,-5 4,-7 C5,-9 7,-8 7,-6 C8,-4 7,-3 6,-3Z"
                fill={color}
            />
        </G>
    );
}

export default function FootprintBanner({
    width = 320,
    height = 180,
    color = "#f59e0a",
    opacity = 0.8, // was 0.15
}: Props) {
    // S-curve: footprints alternate left/right along a sine wave
    const steps = 6;
    const prints: {
        x: number;
        y: number;
        rotation: number;
        scale: number;
        opacity: number;
    }[] = [];

    for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1); // 0 → 1
        const isLeft = i % 2 === 0;

        // S-curve x: sine wave across width
        const sineX = Math.sin(t * Math.PI * 2) * (width * 0.22);
        const centerX = width / 2;
        const footOffset = isLeft ? -14 : 14; // left/right foot spread

        const x = centerX + sineX + footOffset;
        const y = 20 + t * (height - 40); // top → bottom

        // rotation follows the tangent of the S curve
        const dx = Math.cos(t * Math.PI * 2) * Math.PI * 2 * (width * 0.22);
        const dy = height - 40;
        const angle = Math.atan2(dx, dy) * (180 / Math.PI);
        const rotation = isLeft ? angle - 10 : angle + 10;

        // fade in/out at edges
        const edgeFade = Math.sin(t * Math.PI);
        const scale = 2 + edgeFade * 0.4;
        const alpha = opacity * (0.7 + edgeFade * 0.3); // was 0.4 + edgeFade * 0.6

        prints.push({ x, y, rotation, scale, opacity: alpha });
    }

    return (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {prints.map((p, i) => (
                <Footprint
                    key={i}
                    x={p.x}
                    y={p.y}
                    rotation={p.rotation}
                    scale={p.scale}
                    color={color}
                    opacity={p.opacity}
                />
            ))}
        </Svg>
    );
}
