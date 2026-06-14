import { ExtendedProfileFields, Gender } from "@/types/profile";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileStoreState extends ExtendedProfileFields {
  updateProfileFields: (fields: Partial<ExtendedProfileFields>) => void;
  resetProfileFields: () => void;
}

const DEFAULT_FIELDS: ExtendedProfileFields = {
  phone: "",
  gender: "prefer_not_to_say",
  birthday: "",
};

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_FIELDS,
      updateProfileFields: (fields) => set((state) => ({ ...state, ...fields })),
      resetProfileFields: () => set(DEFAULT_FIELDS),
    }),
    {
      name: "akkl-profile-fields",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];
