import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  MessageCircle,
  Download,
  Printer,
  Layers,
  Heart,
  Palette,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ColoringBookData, ImageSize, AspectRatio, ColoringPage } from "./types";
import { getDefaultBook, createSpaceDinoSVG } from "./utils/sampleArt";
import { generateColoringBookPDF } from "./utils/pdfGenerator";
import { ThemePromptBar } from "./components/ThemePromptBar";
import { BookViewer } from "./components/BookViewer";
import { ChatAssistantDrawer } from "./components/ChatAssistantDrawer";
import { PrintView } from "./components/PrintView";

export default function App() {
  const [childName, setChildName] = useState<string>("Leo");
  const [theme, setTheme] = useState<string>("Space Dinosaurs");
  const [imageSize, setImageSize] = useState<ImageSize>("2K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:4");
  const [ageGroup, setAgeGroup] = useState<string>("4-7");

  // Initial Book Data
  const [book, setBook] = useState<ColoringBookData>(() => getDefaultBook("Leo", "Space Dinosaurs"));
  const [activePageIndex, setActivePageIndex] = useState<number>(0); // 0 = Page 1
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepText, setGenerationStepText] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Full 5-Page Book Generation Routine
  const handleGenerateFullBook = async () => {
    if (!theme.trim()) {
      showToast("Please enter a theme for your coloring book!");
      return;
    }

    const currentChild = childName.trim() || "Little Explorer";
    setIsGenerating(true);
    setGenerationStepText("Step 1/6: Planning 5 fun story scenes with Gemini 3.8 Flash...");

    try {
      // 1. Plan Book Outline & 5 Scenes
      const planRes = await fetch("/api/gemini/plan-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: theme.trim(),
          childName: currentChild,
          ageGroup,
        }),
      });

      if (!planRes.ok) {
        const errData = await planRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create coloring book outline");
      }

      const planData = await planRes.json();
      console.log("Coloring book plan received:", planData);

      const initialPages: ColoringPage[] = (planData.pages || []).map((p: any, idx: number) => ({
        pageNumber: p.pageNumber || idx + 1,
        title: p.title || `Page ${idx + 1}`,
        caption: p.caption || `A magical coloring scene for ${currentChild}`,
        imagePrompt: p.imagePrompt || `${theme} line art coloring page`,
        imageUrl: "",
        status: "generating",
        suggestedPalette: p.suggestedPalette || ["Red", "Blue", "Yellow", "Green"],
      }));

      // Update book state with placeholders
      const newBook: ColoringBookData = {
        childName: currentChild,
        theme: theme.trim(),
        ageGroup,
        imageSize,
        aspectRatio,
        bookTitle: planData.bookTitle || `${currentChild}'s ${theme} Adventure`,
        subtitle: planData.subtitle || `A custom coloring book created especially for ${currentChild}!`,
        coverScenePrompt: planData.coverScenePrompt || `Exciting cover art for ${theme}`,
        coverImageUrl: "",
        pages: initialPages,
        createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };

      setBook(newBook);
      setActivePageIndex(-1); // Switch to Cover to show live incoming book

      // 2. Generate Cover Art
      setGenerationStepText(`Step 2/6: Drawing Cover Art at ${imageSize} resolution...`);
      try {
        const coverRes = await fetch("/api/gemini/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: newBook.coverScenePrompt,
            imageSize,
            aspectRatio,
            isCover: true,
            childName: currentChild,
          }),
        });

        if (coverRes.ok) {
          const coverData = await coverRes.json();
          setBook((prev) => ({ ...prev, coverImageUrl: coverData.imageUrl }));
        } else {
          // Fallback cover if needed
          setBook((prev) => ({ ...prev, coverImageUrl: createSpaceDinoSVG(1, currentChild) }));
        }
      } catch (e) {
        console.warn("Cover image generation fallback used", e);
        setBook((prev) => ({ ...prev, coverImageUrl: createSpaceDinoSVG(1, currentChild) }));
      }

      // 3. Generate 5 Distinct Coloring Pages
      for (let i = 0; i < newBook.pages.length; i++) {
        const page = newBook.pages[i];
        setGenerationStepText(
          `Generating Page ${i + 1} of 5 (${page.title}) using gemini-3-pro-image-preview [${imageSize}]...`
        );

        try {
          const imgRes = await fetch("/api/gemini/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: page.imagePrompt,
              imageSize,
              aspectRatio,
              childName: currentChild,
            }),
          });

          if (!imgRes.ok) {
            const err = await imgRes.json().catch(() => ({}));
            throw new Error(err.error || `Failed image generation for page ${i + 1}`);
          }

          const imgData = await imgRes.json();
          setBook((prev) => {
            const updated = [...prev.pages];
            updated[i] = {
              ...updated[i],
              imageUrl: imgData.imageUrl,
              status: "ready",
            };
            return { ...prev, pages: updated };
          });
        } catch (pageErr: any) {
          console.error(`Error on page ${i + 1}:`, pageErr);
          // Set fallback vector art or mark error so user can re-roll
          setBook((prev) => {
            const updated = [...prev.pages];
            updated[i] = {
              ...updated[i],
              imageUrl: createSpaceDinoSVG(i + 1, currentChild),
              status: "ready",
              errorMessage: pageErr?.message,
            };
            return { ...prev, pages: updated };
          });
        }
      }

      showToast(`🎉 Complete 5-Page Coloring Book ready for ${currentChild}!`);
      setActivePageIndex(0); // Show Page 1
    } catch (err: any) {
      console.error("Full book generation error:", err);
      showToast(`Generation notice: ${err?.message || "Using starter book"}`);
    } finally {
      setIsGenerating(false);
      setGenerationStepText("");
    }
  };

  // Regenerate a single specific page
  const handleRegeneratePage = async (pageIndex: number, customPrompt?: string) => {
    if (pageIndex < 0 || pageIndex >= book.pages.length) return;
    const targetPage = book.pages[pageIndex];

    setBook((prev) => {
      const updated = [...prev.pages];
      updated[pageIndex] = { ...updated[pageIndex], status: "generating" };
      return { ...prev, pages: updated };
    });

    try {
      const promptToUse = customPrompt || targetPage.imagePrompt;
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          imageSize,
          aspectRatio,
          childName: book.childName,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate image");
      }

      const data = await res.json();
      setBook((prev) => {
        const updated = [...prev.pages];
        updated[pageIndex] = {
          ...updated[pageIndex],
          imageUrl: data.imageUrl,
          imagePrompt: promptToUse,
          status: "ready",
        };
        return { ...prev, pages: updated };
      });
      showToast(`Page ${pageIndex + 1} updated successfully!`);
    } catch (err: any) {
      console.error("Error regenerating page:", err);
      setBook((prev) => {
        const updated = [...prev.pages];
        updated[pageIndex] = {
          ...updated[pageIndex],
          status: "ready",
          errorMessage: err?.message,
        };
        return { ...prev, pages: updated };
      });
      showToast(`Could not regenerate: ${err?.message}`);
    }
  };

  // Regenerate Cover
  const handleRegenerateCover = async () => {
    try {
      showToast("Generating new cover art with Gemini 3 Pro...");
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: book.coverScenePrompt,
          imageSize,
          aspectRatio,
          isCover: true,
          childName: book.childName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBook((prev) => ({ ...prev, coverImageUrl: data.imageUrl }));
        showToast("Cover art refreshed!");
      }
    } catch (e: any) {
      showToast(`Cover error: ${e?.message}`);
    }
  };

  // Update Page Story Caption
  const handleUpdateCaption = (pageIndex: number, newCaption: string) => {
    setBook((prev) => {
      const updated = [...prev.pages];
      if (updated[pageIndex]) {
        updated[pageIndex] = { ...updated[pageIndex], caption: newCaption };
      }
      return { ...prev, pages: updated };
    });
    showToast("Story caption updated!");
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    try {
      showToast("Preparing your print-ready PDF book...");
      await generateColoringBookPDF(book);
      showToast("PDF Downloaded! Ready to print and color!");
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      showToast("Failed to compile PDF. Please try again.");
    }
  };

  const handlePrintBook = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-stone-50 to-orange-50/30 text-stone-900 font-sans selection:bg-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-in fade-in duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs md:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl md:text-2xl tracking-tight text-stone-900">
                  ColorCraft
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  Kids Studio
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-semibold hidden sm:block">
                Personalized 5-Page Children's Coloring Book Generator
              </p>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Doodle Pal Chat Trigger */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-2 transition-all border border-amber-300 shadow-xs active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">Doodle Pal Chat</span>
              <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full font-black">
                AI
              </span>
            </button>

            {/* Quick Print */}
            <button
              type="button"
              onClick={handlePrintBook}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-stone-200"
              title="Print entire book"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Quick PDF Download */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Creator Bar */}
        <ThemePromptBar
          childName={childName}
          setChildName={setChildName}
          theme={theme}
          setTheme={setTheme}
          imageSize={imageSize}
          setImageSize={setImageSize}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          onGenerateBook={handleGenerateFullBook}
          isGenerating={isGenerating}
          generationStepText={generationStepText}
        />

        {/* Live Progress Bar during full generation */}
        {isGenerating && (
          <div className="bg-amber-100/80 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                {generationStepText}
              </span>
              <span>Gemini 3 Pro Image Preview ({imageSize})</span>
            </div>
            <div className="w-full bg-amber-200/80 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-full rounded-full animate-pulse transition-all w-3/4" />
            </div>
          </div>
        )}

        {/* Book Studio & Viewer */}
        <BookViewer
          book={book}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          onDownloadPDF={handleDownloadPDF}
          onPrintBook={handlePrintBook}
          onRegeneratePage={handleRegeneratePage}
          onRegenerateCover={handleRegenerateCover}
          onUpdateCaption={handleUpdateCaption}
          isGeneratingAny={isGenerating}
        />

        {/* Feature Highlights Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">
                Thick-Line Vector Art (1K, 2K, 4K)
              </h4>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Rendered with <code>gemini-3-pro-image-preview</code> specifically tuned for thick,
                crisp outlines with zero messy shading.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">Custom Personalized Cover & Diploma</h4>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Includes the child's name, dedicated story titles, rhymes, and an official Master
                Artist Certificate in the final PDF!
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">Doodle Pal Co-Creator Chat</h4>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                Multi-turn creative chatbot powered by <code>gemini-3.8-flash</code> to brainstorm
                themes, rhyming stories, and color palettes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Doodle Pal Chat Drawer */}
      <ChatAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        childName={childName}
        theme={theme}
        onApplyTheme={(newTheme) => {
          setTheme(newTheme);
          showToast(`Applied theme: "${newTheme}"`);
        }}
      />

      {/* Hidden Print Container for High-Quality Paper Printing */}
      <PrintView book={book} />
    </div>
  );
}
