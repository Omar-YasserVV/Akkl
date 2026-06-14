import { useProfileStore } from "@/stores/profile-store";
import { PersonalInfoForm } from "@/types/profile";
import { PROFILE_QUERY_KEY, useProfile } from "@/hooks/profile/useProfile";
import { authApis } from "@repo/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatBirthdayForInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function parseBirthdayForApi(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return trimmed;
}

export function usePersonalInfo() {
  const { data: user, isLoading } = useProfile();
  const queryClient = useQueryClient();
  const storedPhone = useProfileStore((state) => state.phone);
  const storedGender = useProfileStore((state) => state.gender);
  const storedBirthday = useProfileStore((state) => state.birthday);
  const updateProfileFields = useProfileStore(
    (state) => state.updateProfileFields,
  );

  const initialForm = useMemo<PersonalInfoForm>(
    () => ({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? storedPhone,
      image: user?.image ?? "",
      gender: user?.gender ?? storedGender,
      birthday: user?.birthDate
        ? formatBirthdayForInput(user.birthDate)
        : storedBirthday,
    }),
    [user, storedPhone, storedGender, storedBirthday],
  );

  const [form, setForm] = useState<PersonalInfoForm>(initialForm);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: authApis.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      updateProfileFields({
        phone: updatedUser.phone ?? form.phone,
        gender: form.gender,
        birthday: form.birthday,
      });
    },
  });

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const updateField = useCallback(
    <K extends keyof PersonalInfoForm>(key: K, value: PersonalInfoForm[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setSaveMessage(null);
    },
    [],
  );

  const saveChanges = useCallback(async () => {
    setSaveMessage(null);

    try {
      const fullName = form.fullName.trim();
      const phone = form.phone.trim();
      const image = form.image.trim();
      const birthDate = parseBirthdayForApi(form.birthday);

      if (!fullName) {
        setSaveMessage("Name is required.");
        return;
      }

      const updatedUser = await updateProfileMutation.mutateAsync({
        fullName,
        phone,
        ...(image ? { image } : {}),
        gender: form.gender,
        ...(birthDate ? { birthDate } : {}),
      });

      updateProfileFields({
        phone,
        gender: updatedUser.gender ?? form.gender,
        birthday: form.birthday.trim(),
      });
      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update profile.";
      setSaveMessage(message);
    }
  }, [form, updateProfileFields, updateProfileMutation]);

  return {
    user,
    form,
    isLoading,
    isSaving: updateProfileMutation.isPending,
    saveMessage,
    updateField,
    saveChanges,
    resetForm: () => setForm(initialForm),
  };
}
