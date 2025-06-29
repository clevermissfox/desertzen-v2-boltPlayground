export type MeditationCategory =
  // | "morning"
  // | "anxiety-stress"
  | "sleep"
  | "body-scan"
  | "guided-imagery"
  | "breathing"
  | "anxiety-relief"
  | "women";

export type MeditationLength = "5m" | "10m" | "15m" | "30m" | "45m" | "60m";

export interface Meditation {
  id: string;
  title: string;
  description: string;
  category: MeditationCategory;
  length: MeditationLength;
  audioUrl: string;
  imageUrl: string;
  featured?: boolean;
  createdAt: string;
}

export interface Category {
  id: MeditationCategory;
  name: string;
  description: string;
  iconName: string;
  availableLengths: MeditationLength[];
}
