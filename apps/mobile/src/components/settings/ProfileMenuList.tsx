import { ProfileMenuItem } from "@/components/profile-menu-item";
import React from "react";

export type ProfileMenuConfig = {
  icon: React.ComponentProps<typeof ProfileMenuItem>["icon"];
  label: string;
  route?: string;
  value?: string;
  onPress?: () => void;
};

type ProfileMenuListProps = {
  items: ProfileMenuConfig[];
};

export function ProfileMenuList({ items }: ProfileMenuListProps) {
  return (
    <>
      {items.map((item, index) => (
        <ProfileMenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          onPress={item.onPress}
          showBorder={index < items.length - 1}
        />
      ))}
    </>
  );
}
