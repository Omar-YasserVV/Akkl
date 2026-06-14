import { MembershipBadge } from "@/components/settings/MembershipBadge";
import { ProfileAvatar } from "@/components/settings/ProfileAvatar";
import { ProfileMenuList } from "@/components/settings/ProfileMenuList";
import { ProfileProgressBar } from "@/components/settings/ProfileProgressBar";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { ProfileStatsRow } from "@/components/settings/ProfileStatsRow";
import { BottomTabInset } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useSession } from "@/context/session-context";
import { useProfile } from "@/hooks/profile/useProfile";
import { useProfileStats } from "@/hooks/profile/useProfileStats";
import { appHref } from "@/lib/navigation";
import { SETTINGS_ROUTES } from "@/lib/settings-routes";
import { LANGUAGE_LABELS } from "@/types/settings";
import { useAppSettings } from "@/hooks/settings/useAppSettings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { logout, isLoading } = useAuth();
  const { data: user, isLoading: isProfileLoading, refetch } = useProfile();
  const { clearSession } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stats } = useProfileStats();
  const { language } = useAppSettings();

  const handleLogout = async () => {
    try {
      await clearSession();
      await logout();
    } catch {
      // logout clears local state even on API failure
    }
  };

  const displayName = user?.fullName ?? "Guest User";

  const accountItems = [
    {
      icon: "person-outline" as const,
      label: "Personal Information",
      onPress: () => router.push(appHref(SETTINGS_ROUTES.personalInfo)),
    },
    {
      icon: "receipt-outline" as const,
      label: "Order History",
      onPress: () => router.push(appHref(SETTINGS_ROUTES.orderHistory)),
    },
    {
      icon: "card-outline" as const,
      label: "Payment Methods",
      onPress: () => router.push(appHref(SETTINGS_ROUTES.paymentMethods)),
    },
    {
      icon: "settings-outline" as const,
      label: "Settings",
      onPress: () => router.push(appHref(SETTINGS_ROUTES.root)),
    },
  ];

  const sessionItems = [
    {
      icon: "restaurant-outline" as const,
      label: "Change Restaurant",
      onPress: () => router.push("/select-restaurant"),
    },
    {
      icon: "location-outline" as const,
      label: "Change Branch",
      onPress: () =>
        router.push({
          pathname: "/select-branch",
          params: { change: "true" },
        }),
    },
    {
      icon: "globe-outline" as const,
      label: "Language",
      value: LANGUAGE_LABELS[language],
      onPress: () => router.push(appHref(SETTINGS_ROUTES.root)),
    },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      <View
        className="bg-white border-b border-gray-100"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 h-14">
          <View className="w-10" />
          <Text className="text-lg font-bold text-[#2D2D2D]">Profile</Text>
          <TouchableOpacity
            onPress={() => router.push(appHref(SETTINGS_ROUTES.root))}
            className="w-10 h-10 items-center justify-center -mr-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={22} color="#2D2D2D" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: BottomTabInset + insets.bottom + 24,
        }}
        refreshControl={
          <RefreshControl refreshing={isProfileLoading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-6">
          <ProfileAvatar
            imageUri={user?.image}
            fullName={displayName}
            seed={user?.username ?? user?.email ?? displayName}
            showEdit
            onEditPress={() => router.push(appHref(SETTINGS_ROUTES.personalInfo))}
          />
          <Text className="text-2xl font-bold text-[#2D2D2D] mt-4 mb-2">
            {displayName}
          </Text>
          <MembershipBadge tier={stats.membershipTier} />
          {user?.email ? (
            <Text className="text-sm text-[#9BA5B7] mt-2">{user.email}</Text>
          ) : null}
        </View>

        <ProfileStatsRow
          totalPoints={stats.totalPoints}
          totalOrders={stats.totalOrders}
        />
        <ProfileProgressBar
          currentPoints={stats.totalPoints}
          nextTierPoints={stats.nextTierPoints}
        />

        <ProfileSection title="ACCOUNT">
          <ProfileMenuList items={accountItems} />
        </ProfileSection>

        <ProfileSection title="SESSION">
          <ProfileMenuList items={sessionItems} />
        </ProfileSection>

        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.7}
          className="flex-row items-center justify-center rounded-2xl py-4 mt-2"
        >
          {isLoading ? (
            <ActivityIndicator color="#EF4444" />
          ) : (
            <Text className="text-base font-bold text-red-500">Logout</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
