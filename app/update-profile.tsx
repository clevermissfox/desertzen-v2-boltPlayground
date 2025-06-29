import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";

export default function UpdateProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick image from device
  async function pickAndUploadImage(userId: string) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });
      console.log("ImagePicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        console.log("Selected image URI:", uri);

        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("Blob created");

        const storage = getStorage();
        const fileRef = ref(storage, `profilePhotos/${userId}`);
        const uploadTask = uploadBytesResumable(fileRef, blob);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            () => {
              console.log("Upload complete");
              resolve();
            }
          );
        });

        const downloadURL = await getDownloadURL(fileRef);
        console.log("Download URL:", downloadURL);
        return downloadURL;
      } else {
        console.log("Picker canceled or no asset.");
      }
      return null;
    } catch (err) {
      console.error("Error in pickAndUploadImage:", err);
      return null;
    }
  }

  const handleSave = async () => {
    setError(null);
    try {
      if (user) {
        await updateProfile(user, {
          displayName,
          photoURL: photoURL || null,
        }); // [1]
        router.back();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 24 }}>
      <Stack.Screen options={{ title: "Edit Profile" }} />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: theme.text,
          marginBottom: 24,
        }}
      >
        Edit Profile
      </Text>
      <TouchableOpacity
        onPress={async () => {
          setUploading(true);
          try {
            const url = await pickAndUploadImage(user?.uid || "");
            if (url) setPhotoURL(url);
          } finally {
            setUploading(false);
          }
        }}
        disabled={uploading}
        style={{ alignSelf: "center", marginBottom: 16 }}
      >
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: theme.border,
            }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.secondaryLight,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.textSecondary }}>Pick Photo</Text>
          </View>
        )}
        {uploading && (
          <ActivityIndicator
            style={{ position: "absolute", top: 40, left: 40 }}
          />
        )}
      </TouchableOpacity>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          color: theme.text,
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
        placeholderTextColor={theme.textTertiary}
      />
      {error && (
        <Text style={{ color: theme.error, marginBottom: 8 }}>{error}</Text>
      )}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: theme.accent,
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
        disabled={uploading}
      >
        <Text style={{ color: theme.neutral0, fontWeight: "bold" }}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}
