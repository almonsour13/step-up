import { Profile } from "@/shared/types/type";
import { create } from "zustand";

type ProfileStore = {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    updateProfile: (partial: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null, // ✅ null until user fills it in
    setProfile: (profile) => set({ profile }),
    updateProfile: (partial) =>
        set((state) => ({
            profile: state.profile
                ? { ...state.profile, ...partial }
                : {
                      id: "",
                      name: "",
                      age: 0,
                      weight: 0,
                      height: 0,
                      gender: null,
                      ...partial,
                  },
        })),
}));
