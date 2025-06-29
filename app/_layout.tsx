import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "@expo-google-fonts/lora";
import { fontAssets } from "@/constants/Fonts";
import { fontFamilies } from "@/constants/Fonts";

export default function RootLayout() {
  useFrameworkReady();
  const { theme, isDark } = useTheme();

  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTitleStyle: {
              fontFamily: fontFamilies.medium,
            },
            headerTintColor: theme.text,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="update-profile"
            options={{ headerShown: true, title: "Update Profile" }}
          />
          <Stack.Screen
            name="meditation/[id]"
            options={{ presentation: "card" }}
          />
          <Stack.Screen name="category/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}