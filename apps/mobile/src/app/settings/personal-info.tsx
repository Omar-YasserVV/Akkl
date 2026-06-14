import { DangerLink } from "@/components/settings/DangerLink";
import { FormField } from "@/components/settings/FormField";
import { GenderPicker } from "@/components/settings/GenderPicker";
import { PrimaryButton } from "@/components/settings/PrimaryButton";
import { ProfileAvatar } from "@/components/settings/ProfileAvatar";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { BottomTabInset } from "@/constants/theme";
import { usePersonalInfo } from "@/hooks/settings/usePersonalInfo";
import { appHref } from "@/lib/navigation";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPhotoField, setShowPhotoField] = useState(false);
  const {
    user,
    form,
    isLoading,
    isSaving,
    saveMessage,
    updateField,
    saveChanges,
  } = usePersonalInfo();

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F8F9FB] items-center justify-center">
        <ActivityIndicator size="large" color="#0057C0" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <SettingsHeader title="Akkl" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[24px] font-extrabold text-[#20242A] mb-1">
          Personal Information
        </Text>
        <Text className="text-[12px] text-[#697386] leading-5 mb-8">
          Update your profile details for a personalized dining experience.
        </Text>

        <View className="items-center mb-7">
          <ProfileAvatar
            imageUri={form.image}
            fullName={form.fullName}
            seed={user?.username ?? form.email ?? form.fullName}
            size={104}
            showEdit
            onEditPress={() => setShowPhotoField(true)}
          />
          <TouchableOpacity
            className="mt-4"
            activeOpacity={0.75}
            onPress={() => setShowPhotoField(true)}
          >
            <Text className="text-[12px] font-extrabold text-[#0066D9]">
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {showPhotoField ? (
          <FormField
            label="Photo URL"
            value={form.image}
            onChangeText={(value) => updateField("image", value)}
            placeholder="https://example.com/profile.jpg"
          />
        ) : null}

        <FormField
          label="Full Name"
          value={form.fullName}
          onChangeText={(value) => updateField("fullName", value)}
          placeholder="Your full name"
        />
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          placeholder="you@example.com"
          keyboardType="email-address"
          editable={false}
        />
        <FormField label="Phone Number" value={form.phone} onChangeText={(value) => updateField("phone", value)} placeholder="+20 123 456 789" keyboardType="phone-pad" />
        <FormField
          label="Password"
          value="••••••••"
          onChangeText={() => {}}
          editable={false}
          rightElement={
            <TouchableOpacity onPress={() => router.push(appHref("/(auth)/sign-in"))}>
              <Text className="text-sm font-semibold text-primary">Change</Text>
            </TouchableOpacity>
          }
        />
        <GenderPicker value={form.gender} onChange={(gender) => updateField("gender", gender)} />
        <FormField label="Birthday" value={form.birthday} onChangeText={(value) => updateField("birthday", value)} placeholder="DD/MM/YYYY" />

        {saveMessage ? (
          <Text className="text-sm text-[#5F6B7A] mb-4 text-center">
            {saveMessage}
          </Text>
        ) : null}

        <PrimaryButton
          label="Save Changes"
          onPress={saveChanges}
          loading={isSaving}
          className="mt-2"
        />
        <DangerLink label="Delete Account" />
      </ScrollView>
    </View>
  );
}
