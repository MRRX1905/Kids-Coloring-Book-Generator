import React from "react";
import { Sparkles, Wand2, Sliders, Layers, User } from "lucide-react";
import { ImageSize, AspectRatio } from "../types";

interface ThemePromptBarProps {
  childName: string;
  setChildName: (name: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  ageGroup: string;
  setAgeGroup: (ag: string) => void;
  onGenerateBook: () => void;
  isGenerating: boolean;
  generationStepText: string;
}

const INSPIRATION_THEMES = [
  { label: "🚀 Space Dinosaurs", theme: "Space Dinosaurs exploring planets" },
  { label: "🧜‍♀️ Deep Sea Mermaids", theme: "Deep Sea Mermaids and dolphin friends" },
  { label: "🚜 Construction Puppies", theme: "Puppies driving construction diggers" },
  { label: "🧁 Animal Bakery", theme: "Woodland animals baking giant cakes" },
  { label: "🐉 Friendly Dragons", theme: "Baby dragons having a garden tea party" },
  { label: "🏎️ Jungle Race Cars", theme: "Safari animals in fast race cars" },
];

export const ThemePromptBar: React.FC<ThemePromptBarProps> = ({
  childName,
  setChildName,
  theme,
  setTheme,
  imageSize,
  setImageSize,
  aspectRatio,
  setAspectRatio,
  ageGroup,
  setAgeGroup,
  onGenerateBook,
  isGenerating,
  generationStepText,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-5 md:p-6 shadow-xl border-3 border-amber-300 relative overflow-hidden">
      {/* Decorative background splashes */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-100/60 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Title & Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>Personalized Coloring Studio</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                5 Pages + Custom Cover
              </span>
            </h2>
            <p className="text-xs md:text-sm text-stone-500 font-medium">
              Pure black-and-white, thick-line printable art powered by Gemini 3 Pro Image Preview
            </p>
          </div>

          {/* Model & Resolution Badge */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-2xl">
            <Layers className="w-4 h-4 text-amber-600" />
            <div className="text-left text-[11px] leading-tight">
              <span className="font-bold text-stone-800 block">gemini-3-pro-image-preview</span>
              <span className="text-stone-500 font-medium">Selected Size: <strong className="text-amber-600">{imageSize}</strong></span>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Child Name */}
          <div className="md:col-span-4">
            <label className="block text-xs font-black uppercase text-stone-700 tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" /> Child's Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Leo, Maya, Oliver..."
                className="w-full bg-stone-50 border-2 border-stone-300 rounded-2xl px-4 py-3 font-bold text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-500 focus:bg-white text-base transition-all"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                Cover Star ⭐
              </span>
            </div>
          </div>

          {/* Theme */}
          <div className="md:col-span-8">
            <label className="block text-xs font-black uppercase text-stone-700 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Book Theme or Adventure
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Space Dinosaurs exploring alien planets, superhero puppies..."
              className="w-full bg-stone-50 border-2 border-stone-300 rounded-2xl px-4 py-3 font-medium text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-500 focus:bg-white text-base transition-all"
            />
          </div>
        </div>

        {/* Theme Inspiration Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-bold text-stone-500 mr-1">Inspirations:</span>
          {INSPIRATION_THEMES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTheme(item.theme)}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all hover:scale-105 active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Options Row: Resolution Selector, Aspect Ratio, Age Calibration */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Resolution Affordance (1K, 2K, 4K) */}
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-600" />
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              Image Size:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-stone-200/80">
              {(["1K", "2K", "4K"] as ImageSize[]).map((size) => {
                const isActive = imageSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      isActive
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-stone-700 hover:text-stone-900"
                    }`}
                    title={
                      size === "1K"
                        ? "1K: Fast standard resolution"
                        : size === "2K"
                        ? "2K: High-res crisp vector lines (Recommended)"
                        : "4K: Ultra-high studio print quality"
                    }
                  >
                    {size}
                    {size === "2K" && " ⭐"}
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              {imageSize === "1K" && "(Fastest)"}
              {imageSize === "2K" && "(Crisp Print lines)"}
              {imageSize === "4K" && "(Ultra Studio Crisp)"}
            </span>
          </div>

          {/* Age Calibration */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              Age Style:
            </span>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="2-4">Ages 2-4 (Extra-thick lines, simple shapes)</option>
              <option value="4-7">Ages 4-7 (Balanced details, playful scenes)</option>
              <option value="8-12">Ages 8-12 (Intricate details, rich scenes)</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-stone-700 tracking-wider">
              Page Ratio:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-stone-200/80">
              {(["3:4", "1:1"] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    aspectRatio === ar
                      ? "bg-stone-800 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {ar === "3:4" ? "3:4 (Book Page)" : "1:1 (Square)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button & Progress */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="text-xs text-stone-600 font-medium">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-amber-700 font-bold animate-pulse">
                <Wand2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span>{generationStepText || "Creating your coloring book..."}</span>
              </div>
            ) : (
              <span>
                Ready to create a personalized <strong>5-page storybook + cover</strong> for{" "}
                <strong>{childName || "your child"}</strong>!
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onGenerateBook}
            disabled={isGenerating || !theme.trim()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-yellow-200" />
            {isGenerating ? "Generating Coloring Book..." : "Generate 5-Page Coloring Book"}
          </button>
        </div>
      </div>
    </div>
  );
};
