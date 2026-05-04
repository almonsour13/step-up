export type Activity = {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    steps: number;
    goal: number;
    createdAt: string;
    updatedAt?: string;
};

type GenerateOptions = {
    months?: number;
    minSessionsPerDay?: number;
    maxSessionsPerDay?: number;
    minStepsPerSession?: number;
    maxStepsPerSession?: number;
    goal?: number;
};

const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomId = () => Math.random().toString(36).substring(2, 10);

export function generateActivities(options?: GenerateOptions): Activity[] {
    const {
        months = 5,
        minSessionsPerDay = 2,
        maxSessionsPerDay = 5,
        minStepsPerSession = 1200,
        maxStepsPerSession = 6000,
        goal = 5000,
    } = options || {};

    const activities: Activity[] = [];

    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - months);

    for (
        let day = new Date(startDate);
        day <= now;
        day.setDate(day.getDate() + 1)
    ) {
        const sessions = randomBetween(minSessionsPerDay, maxSessionsPerDay);

        for (let i = 0; i < sessions; i++) {
            const start = new Date(day);
            start.setHours(randomBetween(6, 22));
            start.setMinutes(randomBetween(0, 59));
            start.setSeconds(0);
            start.setMilliseconds(0);

            const durationMinutes = randomBetween(5, 90);
            const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

            // derive duration from actual startTime/endTime diff
            const duration = Math.round(
                (end.getTime() - start.getTime()) / (60 * 1000),
            );

            const steps = randomBetween(minStepsPerSession, maxStepsPerSession);

            activities.push({
                id: randomId(),
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                duration,
                steps,
                goal,
                createdAt: start.toISOString(),
                updatedAt: end.toISOString(),
            });
        }
    }

    return activities.sort(
        (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
}
