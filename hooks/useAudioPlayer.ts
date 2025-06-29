import { useState, useEffect } from "react";
import { Audio } from "expo-av"; // will need to be transitioned to expo-audio (already installed)
import { Platform } from "react-native";

export function useAudioPlayer(audioUri: string | null) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    try {
      if (!audioUri) return;

      setIsLoading(true);
      setError(null);

      if (sound) {
        await sound.unloadAsync();
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 100,
          positionMillis: 0,
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to load audio");
      console.error("Error loading audio:", err);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      if (!isSeeking) {
        setPosition(status.positionMillis);
      }
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      console.error("Playback error:", status.error);
      setError("Error playing audio");
    }
  };

  const playSound = async () => {
    try {
      if (!sound) {
        await loadAudio();
      }

      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      setError("Failed to play audio");
      console.error("Error playing sound:", err);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (err) {
      setError("Failed to pause audio");
      console.error("Error pausing sound:", err);
    }
  };

  const seekSound = async (positionMillis: number) => {
    try {
      if (sound) {
        await sound.setPositionAsync(positionMillis);
        setPosition(positionMillis);
      }
    } catch (err) {
      setError("Failed to seek audio");
      console.error("Error seeking sound:", err);
    }
  };

  const skipForward = async () => {
    try {
      if (sound && duration) {
        const newPosition = Math.min(position + 10000, duration);
        await seekSound(newPosition);
      }
    } catch (err) {
      setError("Failed to skip forward");
      console.error("Error skipping forward:", err);
    }
  };

  const skipBackward = async () => {
    try {
      if (sound) {
        const newPosition = Math.max(position - 10000, 0);
        await seekSound(newPosition);
      }
    } catch (err) {
      setError("Failed to skip backward");
      console.error("Error skipping backward:", err);
    }
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
  };

  const onSlidingComplete = async (value: number) => {
    if (duration) {
      await seekSound(value * duration);
    }
    setIsSeeking(false);
  };

  useEffect(() => {
    if (audioUri) {
      loadAudio();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  return {
    isPlaying,
    isLoading,
    duration,
    position,
    error,
    play: playSound,
    pause: pauseSound,
    seek: seekSound,
    skipForward,
    skipBackward,
    onSlidingStart,
    onSlidingComplete,
  };
}
