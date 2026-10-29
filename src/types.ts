export type ImageSize = "1K" | "2K" | "4K";
export type AspectRatio = "3:4" | "1:1";

export interface ColoringPage {
  pageNumber: number;
  title: string;
  caption: string;
  imagePrompt: string;
  imageUrl?: string;
  status: "idle" | "planning" | "generating" | "ready" | "error";
  errorMessage?: string;
  suggestedPalette?: string[];
}

export interface ColoringBookData {
  childName: string;
  theme: string;
  ageGroup: string;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
  bookTitle: string;
  subtitle: string;
  coverScenePrompt: string;
  coverImageUrl?: string;
  pages: ColoringPage[];
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedTheme?: string;
}
