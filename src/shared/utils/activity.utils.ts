export const formatDuration = (duration: number): string => {
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0)
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

function getStrideLengthMeters(heightCm: number): number {
    return (heightCm * 0.415) / 100;
}
export function calcDistanceKm(steps: number, heightCm: number): number {
    const strideM = getStrideLengthMeters(heightCm);
    return (steps * strideM) / 1000;
}

export function calcCalories(steps: number, weightKg: number): number {
    // ~0.04 kcal per step for a 70kg person, scaled by weight
    const kcalPerStep = 0.04 * (weightKg / 70);
    return steps * kcalPerStep;
}
