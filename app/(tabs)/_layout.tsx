import React, { useEffect } from "react";
import { Tabs } from "expo-router";
// import { Chrome as Home, Compass, Heart, User } from 'lucide-react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { SplashScreen } from "expo-router";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useFonts } from "expo-font";
import { fontAssets } from "@/constants/Fonts";
import { fontFamilies } from "@/constants/Fonts";
// import {
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_700Bold,
// } from "@expo-google-fonts/inter";

export default function TabLayout() {
  useFrameworkReady();
  const { theme } = useTheme();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // const [fontsLoaded, fontError] = useFonts({
  //   "Inter-Regular": Inter_400Regular,
  //   "Inter-Medium": Inter_500Medium,
  //   "Inter-Bold": Inter_700Bold,
  // });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          fontFamily: fontFamilies.medium,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
