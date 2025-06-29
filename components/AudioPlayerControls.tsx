import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
// import { Play, Pause, SkipBack, SkipForward, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from "../hooks/useTheme";
import Spacing from "../constants/Spacing";
import Typography from "../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface AudioPlayerControlsProps {
  audioUri: string;
  title: string;
}

function AudioPlayerControls({ audioUri, title }: AudioPlayerControlsProps) {
  const { theme } = useTheme();
  const {
    isPlaying,
    isLoading,
    duration,
    position,
    error,
    play,
    pause,
    skipForward,
    skipBackward,
    onSlidingStart,
    onSlidingComplete,
  } = useAudioPlayer(audioUri);

  const [timeDisplayed, setTimeDisplayed] = useState("0:00");
  const [durationDisplayed, setDurationDisplayed] = useState("0:00");

  useEffect(() => {
    if (duration) {
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      setDurationDisplayed(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }
  }, [duration]);

  useEffect(() => {
    const minutes = Math.floor(position / 60000);
    const seconds = Math.floor((position % 60000) / 1000);
    setTimeDisplayed(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  }, [position]);

  const handlePlayPause = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSkipBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    skipBackward();
  };

  const handleSkipForward = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    skipForward();
  };

  if (error) {
    return (
      <View style={[viewStyles.container, viewStyles.errorContainer]}>
        <Ionicons name="alert-circle" color={theme.error} size={24} />
        <Text style={[textStyles.errorText, { color: theme.error }]}>
          Failed to load audio
        </Text>
      </View>
    );
  }

  return (
    <View style={viewStyles.container}>
      {/* <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text> */}

      <View style={viewStyles.timeContainer}>
        <Text style={[textStyles.timeText, { color: theme.textSecondary }]}>
          {timeDisplayed}
        </Text>
        <Text style={[textStyles.timeText, { color: theme.textSecondary }]}>
          {durationDisplayed}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={duration ? position / duration : 0}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={theme.accent}
        maximumTrackTintColor={theme.textTertiary}
        thumbTintColor={theme.accent}
        disabled={isLoading}
      />

      <View style={viewStyles.controlsContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipBack}
          disabled={isLoading}
        >
          <Ionicons
            name="play-skip-back"
            color={isLoading ? theme.textTertiary : theme.textSecondary}
            size={28}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: theme.accent },
            isLoading && { opacity: 0.7 },
          ]}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.textTertiary} size="small" />
          ) : isPlaying ? (
            <Ionicons name="pause" color={theme.textSecondary} size={28} />
          ) : (
            <Ionicons name="play" color={theme.textSecondary} size={28} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipForward}
          disabled={isLoading}
        >
          <Ionicons
            name="play-skip-forward"
            color={isLoading ? theme.textTertiary : theme.textSecondary}
            size={28}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const viewStyles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
});

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 40,
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
  },
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

const textStyles = StyleSheet.create({
  errorText: {
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.medium,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    // fontWeight: Typography.fontWeights.bold,
    fontFamily: fontFamilies.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  timeText: {
    fontSize: Typography.fontSizes.sm,
  },
});

export { AudioPlayerControls };
