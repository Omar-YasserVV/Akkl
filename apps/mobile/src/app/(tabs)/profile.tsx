import { ProfileMenuItem } from "@/components/profile-menu-item";
import { BottomTabInset } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { useSession } from "@/context/session-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-semibold tracking-widest text-[#9BA5B7] mb-3 px-1">
        {title}
      </Text>
      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm shadow-black/5">
        {children}
      </View>
    </View>
  );
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const { clearSession } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleLogout = async () => {
    try {
      await clearSession();
      await logout();
    } catch {
      // logout clears local state even on API failure
    }
  };

  const displayName = user?.fullName ?? "Guest User";
  const memberBadge = user?.role?.replace(/_/g, " ").toUpperCase() ?? "MEMBER";

  return (
    <View className="flex-1 bg-[#F8F9FB]">
      {/* Header */}
      <View
        className="bg-white border-b border-gray-100"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 h-14">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center -ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-[#2D2D2D]">Profile</Text>
          <TouchableOpacity
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
        showsVerticalScrollIndicator={false}
      >
        {/* User info */}
        <View className="items-center mb-8">
          <View className="relative mb-4">
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={{ width: 112, height: 112, borderRadius: 56 }}
                contentFit="cover"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-primary/15 items-center justify-center">
                <Text className="text-3xl font-bold text-primary">
                  {getInitials(displayName)}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center border-2 border-white"
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-[#2D2D2D] mb-2">
            {displayName}
          </Text>

          <View className="flex-row items-center bg-[#E3F2FD] rounded-full px-3 py-1.5 mb-2">
            <View className="w-5 h-5 rounded-full bg-primary items-center justify-center mr-2">
              <Ionicons name="star" size={12} color="#fff" />
            </View>
            <Text className="text-xs font-bold tracking-wide text-primary">
              {memberBadge}
            </Text>
          </View>

          {user?.email ? (
            <Text className="text-sm text-[#9BA5B7]">{user.email}</Text>
          ) : null}
        </View>

        {/* Quick actions */}
        <ProfileSection title="QUICK ACTIONS">
          <ProfileMenuItem icon="receipt-outline" label="My Orders" />
          <ProfileMenuItem
            icon="restaurant-outline"
            label="Change Restaurant"
            onPress={() => router.push("/select-restaurant")}
          />
          <ProfileMenuItem
            icon="location-outline"
            label="Change Branch"
            onPress={() =>
              router.push({
                pathname: "/select-branch",
                params: { change: "true" },
              })
            }
          />
          <ProfileMenuItem icon="card-outline" label="Payment Methods" />
          <ProfileMenuItem
            icon="location-outline"
            label="Saved Addresses"
            showBorder={false}
          />
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection title="PREFERENCES">
          <ProfileMenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => router.push("/reservation/notifications")}
          />
          <ProfileMenuItem
            icon="globe-outline"
            label="Language"
            value="English (US)"
          />
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            showBorder={false}
          />
        </ProfileSection>

        {/* Log out */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.7}
          className="flex-row items-center justify-center bg-[#ECEEF2] rounded-2xl py-4 mt-2"
        >
          {isLoading ? (
            <ActivityIndicator color="#2D2D2D" />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#2D2D2D"
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-bold text-[#2D2D2D]">
                Log Out
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
