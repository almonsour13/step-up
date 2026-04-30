export type Activity = {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    steps: number;
    goalStep: number;
    distance?: number;
    calories?: number;
    avgPace?: number;
    createdAt: string;
};
