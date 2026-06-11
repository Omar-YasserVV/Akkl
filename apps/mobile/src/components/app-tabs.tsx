import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

const TABS = [
  { name: "index", label: "Home", icon: "home" },
  { name: "explore", label: "Menu", icon: "restaurant-menu" },
  { name: "orders", label: "Orders", icon: "receipt-long" },
  { name: "profile", label: "Profile", icon: "person" },
] as const;

const ACTIVE_COLOR = "#0057c0";
const INACTIVE_COLOR = "#414755";
const PILL_BG = "#dce8fb";

function CustomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const getActive = (name: string) => {
    if (name === "index") return pathname === "/";
    return pathname.startsWith(`/${name}`);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = getActive(tab.name);
        return (
          <Pressable
            key={tab.name}
            onPress={() =>
              router.push(tab.name === "index" ? "/" : `/${tab.name}`)
            }
            style={styles.tab}
          >
            <View style={[styles.pill, active && styles.pillActive]}>
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      tabBar={() => <CustomTabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: PILL_BG,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: INACTIVE_COLOR,
  },
  labelActive: {
    color: ACTIVE_COLOR,
  },
});
