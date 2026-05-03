import { Profile } from "@/shared/types/type";
import { create } from "zustand";

type ProfileStore = {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    updateProfile: (partial: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: {
        id: "1",
        name: "John Doe",
        age: 30,
        weight: 70,
        height: 170,
        gender: "male",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    setProfile: (profile) => set({ profile }),
    updateProfile: (partial) =>
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...partial } : null,
        })),
}));
