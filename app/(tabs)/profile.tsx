import { useState, useEffect, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { logout } from "@/firebase/auth";
import { User } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "../../components/ThemeToggle";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { theme, isDark, setTheme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false);

  type SettingItemProps = {
    icon: ReactNode;
    title: string;
    onPress: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (value: boolean) => void;
  };

  const SettingItem = ({
    icon,
    title,
    onPress,
    showToggle = false,
    toggleValue = false,
    onToggleChange = () => {},
  }: SettingItemProps) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>{icon}</View>
      <Text style={[styles.settingText, { color: theme.text }]}>{title}</Text>
      <View style={styles.settingRightContainer}>
        {showToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{
              false: isDark ? theme.border : theme.primary,
              true: theme.accent,
            }}
            thumbColor={Platform.select({
              web: toggleValue
                ? theme.neutral0
                : isDark
                ? theme.neutral0
                : theme.primary,
              default: isDark
                ? theme.neutral0
                : toggleValue
                ? theme.neutral0
                : theme.primary,
            })}
            ios_backgroundColor={isDark ? theme.border : theme.primaryLight}
            style={Platform.select({
              web: {
                opacity: 1,
                transform: [{ scale: 0.8 }],
              },
              default: {},
            })}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textTertiary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const GuestView = () => (
    <View style={styles.guestContainer}>
      <View
        style={[
          styles.guestIconContainer,
          { backgroundColor: theme.secondaryLight },
        ]}
      >
        <Ionicons name="person" size={40} color={theme.primary} />
      </View>
      <Text style={[styles.guestTitle, { color: theme.text }]}>Guest Mode</Text>
      <Text style={[styles.guestText, { color: theme.textSecondary }]}>
        Create an account to save your favorites and track your progress.
      </Text>
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.accent }]}
        onPress={() => router.push("/auth")}
      >
        <Text style={[styles.loginButtonText, { color: theme.neutral0 }]}>
          Sign In / Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );

  const UserProfileView = ({ user }: { user: User }) => (
    <View style={styles.userProfileContainer}>
      {user.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
      ) : (
        <View
          style={[
            styles.guestIconContainer,
            { backgroundColor: theme.secondaryLight },
          ]}
        >
          <Ionicons name="person" size={40} color={theme.primary} />
        </View>
      )}

      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>
          {user.displayName || "User"}
        </Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
          {user.email}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.editButton, { borderColor: theme.border }]}
        onPress={() => router.push("/update-profile")}
      >
        <Text style={[styles.editButtonText, { color: theme.textSecondary }]}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {user ? <UserProfileView user={user} /> : <GuestView />}

      <View style={viewStyles.settingsContainer}>
        <Text style={[textStyles.sectionTitle, { color: theme.text }]}>
          App Settings
        </Text>

        <View
          style={[
            viewStyles.settingsGroup,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <SettingItem
            icon={
              <Ionicons
                name="notifications"
                size={22}
                color={theme.accentLight}
              />
            }
            title="Notifications"
            showToggle={true}
            toggleValue={notificationsEnabled}
            onToggleChange={setNotificationsEnabled}
            onPress={() => {}}
          />

          <SettingItem
            icon={
              <Ionicons name="moon" size={22} color={theme.accentLight} />
            }
            title="Dark Mode"
            showToggle={true}
            toggleValue={isDark}
            onToggleChange={(value) => setTheme(value)}
            onPress={() => {}}
          />

          <SettingItem
            icon={
              <Ionicons name="download" size={22} color={theme.accentLight} />
            }
            title="Auto Download"
            showToggle={true}
            toggleValue={autoDownloadEnabled}
            onToggleChange={setAutoDownloadEnabled}
            onPress={() => {}}
          />
        </View>

        <Text style={[textStyles.sectionTitle, { color: theme.text }]}>
          Playback
        </Text>

        <View
          style={[
            viewStyles.settingsGroup,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <SettingItem
            icon={
              <Ionicons
                name="volume-high"
                size={22}
                color={theme.accentLight}
              />
            }
            title="Audio Quality"
            onPress={() => {}}
          />

          <SettingItem
            icon={
              <Ionicons name="time" size={22} color={theme.accentLight} />
            }
            title="Sleep Timer"
            onPress={() => {}}
          />
        </View>

        <Text style={[textStyles.sectionTitle, { color: theme.text }]}>
          Other
        </Text>

        <View
          style={[
            viewStyles.settingsGroup,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <SettingItem
            icon={
              <Ionicons name="settings" size={22} color={theme.accentLight} />
            }
            title="About Desert Zen"
            onPress={() => {}}
          />

          {user && (
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={[textStyles.logoutText, { color: theme.error }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[textStyles.versionText, { color: theme.textTertiary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontFamily: fontFamilies.bold,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: Typography.fontSizes.md,
    marginBottom: Spacing.sm,
  },
  logoutText: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.md,
  },
  versionText: {
    textAlign: "center",
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.sm,
    marginTop: Spacing.lg,
  },
});

const viewStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  settingsContainer: {
    paddingHorizontal: Spacing.md,
  },
  settingsGroup: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },

  guestContainer: {
    alignItems: "center",
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  guestIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  guestTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: Typography.fontSizes.xl,
    marginBottom: Spacing.sm,
  },
  guestText: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeights.body * Typography.fontSizes.md,
  },
  loginButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
  },
  loginButtonText: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.md,
  },
  userProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: Typography.fontSizes.lg,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  editButtonText: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.sm,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
  },
  settingRightContainer: {
    marginLeft: Spacing.sm,
  },
  logoutButton: {
    padding: Spacing.md,
    alignItems: "center",
  },
});