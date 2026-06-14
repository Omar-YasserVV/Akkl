import { buildBoringAvatarDataUri } from "@/utils/profile";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ProfileAvatarProps = {
  imageUri?: string | null;
  fullName: string;
  seed?: string | null;
  size?: number;
  showEdit?: boolean;
  onEditPress?: () => void;
};

export function ProfileAvatar({
  imageUri,
  fullName,
  seed,
  size = 112,
  showEdit = false,
  onEditPress,
}: ProfileAvatarProps) {
  const radius = size / 2;
  const avatarUri = imageUri || buildBoringAvatarDataUri(seed || fullName, size * 2);

  return (
    <View className="relative" style={{ width: size, height: size }}>
      <Image
        source={{ uri: avatarUri }}
        style={{ width: size, height: size, borderRadius: radius }}
        contentFit="cover"
      />
      {showEdit ? (
        <TouchableOpacity
          onPress={onEditPress}
          className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center border-2 border-white"
          activeOpacity={0.8}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
