import React, { useState } from "react";
import {
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Palette,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit3,
} from "lucide-react";
import { ColoringBookData, ColoringPage } from "../types";
import { InteractiveColoringCanvas } from "./InteractiveColoringCanvas";

interface BookViewerProps {
  book: ColoringBookData;
  activePageIndex: number; // -1 for Cover, 0..4 for Pages, 5 for Certificate
  setActivePageIndex: (idx: number) => void;
  onDownloadPDF: () => void;
  onPrintBook: () => void;
  onRegeneratePage: (pageIndex: number, customPrompt?: string) => void;
  onRegenerateCover: () => void;
  onUpdateCaption: (pageIndex: number, newCaption: string) => void;
  isGeneratingAny: boolean;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  book,
  activePageIndex,
  setActivePageIndex,
  onDownloadPDF,
  onPrintBook,
  onRegeneratePage,
  onRegenerateCover,
  onUpdateCaption,
  isGeneratingAny,
}) => {
  const [viewMode, setViewMode] = useState<"preview" | "coloring">("preview");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaptionText, setEditedCaptionText] = useState("");
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [customRegenPrompt, setCustomRegenPrompt] = useState("");

  const currentPage: ColoringPage | undefined =
    activePageIndex >= 0 && activePageIndex < book.pages.length
      ? book.pages[activePageIndex]
      : undefined;

  const handleStartEditCaption = () => {
    if (currentPage) {
      setEditedCaptionText(currentPage.caption);
      setIsEditingCaption(true);
    }
  };

  const handleSaveCaption = () => {
    if (currentPage && activePageIndex >= 0) {
      onUpdateCaption(activePageIndex, editedCaptionText);
      setIsEditingCaption(false);
    }
  };

  const handleOpenRegenModal = () => {
    if (currentPage) {
      setCustomRegenPrompt(currentPage.imagePrompt);
      setShowRegenModal(true);
    }
  };

  const handlePrintSinglePage = () => {
    window.print();
  };

  const handleDownloadSingleImage = () => {
    const imgUrl =
      activePageIndex === -1
        ? book.coverImageUrl
        : currentPage?.imageUrl;

    if (!imgUrl) return;
    const link = document.createElement("a");
    const title = activePageIndex === -1 ? "Cover" : `Page_${activePageIndex + 1}`;
    link.download = `${book.childName}_${title}.png`;
    link.href = imgUrl;
    link.click();
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Book Toolbar */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 md:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{book.bookTitle || `${book.childName}'s Coloring Book`}</span>
              <span className="text-xs bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                5 Story Pages
              </span>
            </h1>
            <p className="text-xs text-stone-400 font-medium">
              Child: <strong className="text-amber-300">{book.childName}</strong> • Resolution:{" "}
              <strong className="text-amber-300">{book.imageSize}</strong> • Theme: {book.theme}
            </p>
          </div>
        </div>

        {/* Global Book Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View mode toggle */}
          {activePageIndex >= 0 && activePageIndex < book.pages.length && (
            <div className="bg-stone-800 p-1 rounded-2xl flex items-center border border-stone-700 mr-2">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-stone-600 text-white shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Clean Line Art
              </button>
              <button
                type="button"
                onClick={() => setViewMode("coloring")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "coloring"
                    ? "bg-amber-500 text-stone-950 shadow-xs"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Virtual Crayons
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onPrintBook}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-2 border border-stone-700 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-stone-300" />
            <span>Print Book</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete PDF</span>
          </button>
        </div>
      </div>

      {/* Page Tabs / Navigation Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {/* Cover Tab */}
        <button
          type="button"
          onClick={() => setActivePageIndex(-1)}
          className={`shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 border-2 ${
            activePageIndex === -1
              ? "bg-amber-500 text-stone-950 border-amber-600 shadow-md scale-105"
              : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cover Page</span>
        </button>

        {/* 5 Story Pages Tabs */}
        {book.pages.map((p, idx) => {
          const isActive = activePageIndex === idx;
          const isReady = p.status === "ready" && p.imageUrl;
          const isGenerating = p.status === "generating";
          const isError = p.status === "error";

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePageIndex(idx)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border-2 ${
                isActive
                  ? "bg-amber-500 text-stone-950 border-amber-600 shadow-md scale-105"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
              }`}
            >
              <span>Page {idx + 1}</span>
              {isReady && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {isGenerating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />}
              {isError && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
            </button>
          );
        })}

        {/* Bonus Certificate Tab */}
        <button
          type="button"
          onClick={() => setActivePageIndex(5)}
          className={`shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 border-2 ${
            activePageIndex === 5
              ? "bg-amber-500 text-stone-950 border-amber-600 shadow-md scale-105"
              : "bg-white text-stone-700 border-stone-200 hover:bg-amber-50"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Award Certificate</span>
        </button>
      </div>

      {/* Main Page Content Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-stone-200">
        {/* ==================================================== */}
        {/* COVER PAGE VIEW */}
        {/* ==================================================== */}
        {activePageIndex === -1 && (
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 text-center">
            {/* Action Bar for Cover */}
            <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Book Cover Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRegenerateCover}
                  disabled={isGeneratingAny}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Cover Art</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSingleImage}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG</span>
                </button>
              </div>
            </div>

            {/* Realistic Printable Cover Mockup */}
            <div className="w-full max-w-[480px] bg-white border-4 border-stone-900 rounded-2xl p-6 shadow-2xl relative space-y-4">
              {/* Decorative Border */}
              <div className="border border-stone-400 p-4 rounded-xl space-y-4">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                  A PERSONALIZED COLORING ADVENTURE FOR
                </div>

                <div className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
                  {book.childName.toUpperCase() || "LITTLE EXPLORER"}
                </div>

                <div className="text-lg md:text-xl font-bold text-stone-800 leading-snug">
                  {book.bookTitle}
                </div>

                <div className="text-xs text-stone-500 italic max-w-xs mx-auto">
                  {book.subtitle}
                </div>

                {/* Cover Art Frame */}
                <div className="w-full aspect-[3/4] bg-stone-50 border-2 border-stone-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt="Cover Illustration"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="p-6 text-stone-400 text-xs">Cover Art Loading...</div>
                  )}
                </div>

                {/* "Belongs To" Box */}
                <div className="border border-stone-800 rounded-xl p-3 text-left space-y-1 bg-stone-50/50">
                  <div className="text-[10px] font-black uppercase text-stone-700 tracking-wider">
                    THIS BOOK BELONGS TO:
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {book.childName || "_________________"}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Artist Age: ________   •   Date: {book.createdDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* INDIVIDUAL COLORING PAGES 1 - 5 */}
        {/* ==================================================== */}
        {currentPage && activePageIndex >= 0 && activePageIndex < book.pages.length && (
          <div className="space-y-6">
            {/* Page Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-sm border border-amber-300">
                  #{activePageIndex + 1}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-stone-900">
                    {currentPage.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Thick black-and-white lines • Easy for crayons & markers
                  </p>
                </div>
              </div>

              {/* Action Buttons for this page */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleOpenRegenModal}
                  disabled={isGeneratingAny || currentPage.status === "generating"}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                  title="Regenerate this specific page line art"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      currentPage.status === "generating" ? "animate-spin" : ""
                    }`}
                  />
                  <span>Regenerate Page</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSinglePage}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSingleImage}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG</span>
                </button>
              </div>
            </div>

            {/* Main Interactive or Clean Preview */}
            {viewMode === "coloring" && currentPage.imageUrl ? (
              <InteractiveColoringCanvas
                lineArtUrl={currentPage.imageUrl}
                pageTitle={currentPage.title}
                suggestedPalette={currentPage.suggestedPalette}
                childName={book.childName}
              />
            ) : (
              /* Clean Line Art Printable Canvas Preview */
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[560px] bg-white border-4 border-stone-900 rounded-3xl p-6 shadow-2xl space-y-4">
                  {/* Subtle Top Header */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-2">
                    <span>{book.childName}'s Coloring Book</span>
                    <span>Page {activePageIndex + 1} of 5</span>
                  </div>

                  {/* Main Line Art Image */}
                  <div className="w-full aspect-[3/4] bg-white border-2 border-stone-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
                    {currentPage.status === "generating" ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                        <div className="font-bold text-sm text-stone-800">
                          Generating High-Res Line Art...
                        </div>
                        <div className="text-xs text-stone-500">
                          Drawing thick black outlines at {book.imageSize} resolution
                        </div>
                      </div>
                    ) : currentPage.imageUrl ? (
                      <img
                        src={currentPage.imageUrl}
                        alt={currentPage.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-stone-400 text-sm">No image available</div>
                    )}
                  </div>

                  {/* Rhyming Story Caption */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-center space-y-1 relative group">
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Story Moment
                    </div>
                    {isEditingCaption ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          value={editedCaptionText}
                          onChange={(e) => setEditedCaptionText(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl p-2 text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingCaption(false)}
                            className="px-2 py-1 text-xs text-stone-600 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveCaption}
                            className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-sm md:text-base font-semibold text-stone-800 italic">
                          "{currentPage.caption}"
                        </p>
                        <button
                          type="button"
                          onClick={handleStartEditCaption}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-stone-400 hover:text-amber-700"
                          title="Edit Caption"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Suggested Palette Badges */}
                    {currentPage.suggestedPalette && currentPage.suggestedPalette.length > 0 && (
                      <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">
                          Crayons:
                        </span>
                        {currentPage.suggestedPalette.map((col, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded-full"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Next/Prev Page navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActivePageIndex(activePageIndex - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous (
                {activePageIndex === 0 ? "Cover" : `Page ${activePageIndex}`})
              </button>

              <button
                type="button"
                onClick={() => setActivePageIndex(activePageIndex + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-600 flex items-center gap-1.5 shadow-xs"
              >
                <span>
                  Next ({activePageIndex === book.pages.length - 1 ? "Award Certificate" : `Page ${activePageIndex + 2}`})
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* PAGE 7: BONUS AWARD CERTIFICATE */}
        {/* ==================================================== */}
        {activePageIndex === 5 && (
          <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Bonus Artist Diploma
              </span>
              <button
                type="button"
                onClick={handlePrintSinglePage}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Diploma</span>
              </button>
            </div>

            {/* Diploma Mockup */}
            <div className="w-full max-w-[520px] bg-white border-4 border-stone-900 rounded-3xl p-8 shadow-2xl relative space-y-5 text-stone-900">
              <div className="border-2 border-stone-300 p-6 rounded-2xl space-y-4">
                <div className="text-xs font-black uppercase text-stone-500 tracking-widest">
                  OFFICIAL COLORING BOOK DIPLOMA
                </div>

                <div className="text-2xl md:text-3xl font-black text-amber-600">
                  MASTER ARTIST AWARD
                </div>

                <p className="text-xs text-stone-600">This certificate is proudly awarded to:</p>

                <div className="text-3xl md:text-4xl font-black text-stone-950 border-b-2 border-stone-800 pb-1 w-3/4 mx-auto">
                  {book.childName || "Little Master Artist"}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                  for outstanding creativity, bold crayon work, and completing all 5 pages of the{" "}
                  <strong>{book.bookTitle || book.theme}</strong> coloring adventure!
                </p>

                {/* Big Colorable Medal / Stamp */}
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-stone-800 flex flex-col items-center justify-center p-2 relative bg-amber-50/50">
                  <span className="text-[9px] font-black uppercase">COLOR ME!</span>
                  <span className="text-xl">★ ★ ★</span>
                  <span className="text-[8px] font-bold text-stone-500">OFFICIAL SEAL</span>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                  <div className="space-y-1">
                    <div className="h-6 border-b border-stone-400" />
                    <div className="text-[10px] font-bold text-stone-500">
                      Parent / Teacher Signature
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 border-b border-stone-400" />
                    <div className="text-[10px] font-bold text-stone-500">
                      Artist's Official Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Re-roll / Custom Prompt Modal */}
      {showRegenModal && currentPage && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border-2 border-amber-300">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-black text-base text-stone-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-500" />
                <span>Regenerate Page {activePageIndex + 1}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Customize or tweak the line art prompt below. We'll automatically enforce thick black
              outlines and zero shading for coloring books using <strong>gemini-3-pro-image-preview</strong> (
              {book.imageSize}).
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Scene Description:</label>
              <textarea
                value={customRegenPrompt}
                onChange={(e) => setCustomRegenPrompt(e.target.value)}
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-800 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegenModal(false);
                  onRegeneratePage(activePageIndex, customRegenPrompt);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Regenerate Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
