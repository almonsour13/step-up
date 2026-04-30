import { create } from "zustand";

export interface UserProfile {
    name: string;
    age: number;
    weight: number; // in kg
    height: number; // in cm
    gender: "male" | "female" | "other";
}

export interface UserState {
    profile: UserProfile | null;
    stepGoal: number;
}

export interface UserActions {
    setProfile: (profile: UserProfile) => void;
    setStepGoal: (goal: number) => void;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
    profile: null,
    stepGoal: 0,
    setProfile: (profile) => set({ profile }),
    setStepGoal: (goal) => set({ stepGoal: goal }),
}));

// const useUserStore = create<UserStore>()(
//     persist(
//         (set) => ({
//             profile: null,
//             stepGoal: 0,
//             setProfile: (profile) => set({ profile }),
//             setStepGoal: (goal) => set({ stepGoal: goal }),
//         }),
//         {
//             name: "user-storage",
//             storage: createJSONStorage(() => AsyncStorage),
//             partialize: (s): UserState => ({
//                 profile: s.profile,
//                 stepGoal: s.stepGoal,
//             }),
//         },
//     ),
// );

// export default useUserStore;
