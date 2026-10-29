import React from "react";
import { ColoringBookData } from "../types";

interface PrintViewProps {
  book: ColoringBookData;
}

export const PrintView: React.FC<PrintViewProps> = ({ book }) => {
  return (
    <div className="hidden print:block w-full text-black bg-white">
      {/* 1. Cover Page */}
      <div className="break-after-page min-h-[98vh] flex flex-col justify-between p-8 border-4 border-black box-border">
        <div className="text-center space-y-4 pt-4">
          <p className="text-sm font-bold tracking-widest uppercase">
            A Personalized Coloring Adventure For
          </p>
          <h1 className="text-5xl font-black tracking-tight">{book.childName.toUpperCase()}</h1>
          <h2 className="text-2xl font-bold">{book.bookTitle}</h2>
          <p className="text-sm italic">{book.subtitle}</p>
        </div>

        {/* Cover Art */}
        <div className="w-full max-w-[420px] aspect-[3/4] mx-auto border-2 border-black flex items-center justify-center p-2">
          {book.coverImageUrl && (
            <img
              src={book.coverImageUrl}
              alt="Cover Art"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* This Book Belongs To Box */}
        <div className="border-2 border-black rounded-lg p-4 text-center max-w-md mx-auto w-full space-y-1">
          <p className="text-xs font-black uppercase">THIS COLORING BOOK BELONGS TO:</p>
          <p className="text-lg font-bold">{book.childName}</p>
          <p className="text-xs">Artist Age: ________   •   Date Started: {book.createdDate}</p>
        </div>

        <div className="text-center text-xs text-gray-500 pb-2">
          Created with ColorCraft • Designed for Big Imaginations!
        </div>
      </div>

      {/* 2. 5 Distinct Coloring Pages */}
      {book.pages.map((page, idx) => (
        <div
          key={idx}
          className="break-after-page min-h-[98vh] flex flex-col justify-between p-8 border-2 border-black box-border"
        >
          {/* Top header */}
          <div className="flex justify-between items-center text-xs font-bold border-b-2 border-black pb-2">
            <span>{book.childName.toUpperCase()}'S COLORING BOOK</span>
            <span>{book.theme.toUpperCase()}</span>
            <span>PAGE {idx + 1} OF 5</span>
          </div>

          {/* Page Title */}
          <div className="text-center pt-2">
            <h3 className="text-xl font-black">{page.title}</h3>
          </div>

          {/* Large Printable Art Canvas */}
          <div className="w-full max-w-[540px] aspect-[3/4] mx-auto border-2 border-black flex items-center justify-center p-2">
            {page.imageUrl && (
              <img
                src={page.imageUrl}
                alt={page.title}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Story Caption */}
          <div className="text-center px-4 space-y-2">
            <p className="text-sm font-medium italic">"{page.caption}"</p>
            {page.suggestedPalette && page.suggestedPalette.length > 0 && (
              <p className="text-xs text-gray-600">
                Suggested Crayons: {page.suggestedPalette.join(" • ")}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs font-bold border-t border-gray-300 pt-2">
            — Page {idx + 1} —
          </div>
        </div>
      ))}

      {/* 3. Certificate of Master Artist */}
      <div className="break-after-page min-h-[98vh] flex flex-col justify-between p-10 border-4 border-black text-center box-border">
        <div className="space-y-4 pt-6">
          <p className="text-sm font-black tracking-widest uppercase">
            Official Coloring Book Diploma
          </p>
          <h1 className="text-4xl font-black">MASTER ARTIST AWARD</h1>
          <p className="text-sm">This certificate is proudly awarded to:</p>
          <div className="text-4xl font-black border-b-2 border-black pb-2 w-2/3 mx-auto">
            {book.childName}
          </div>
          <p className="text-sm max-w-md mx-auto pt-2">
            for magnificent imagination, brilliant colors, and completing all 5 coloring pages in the{" "}
            <strong>{book.bookTitle || book.theme}</strong> book!
          </p>
        </div>

        {/* Colorable Seal */}
        <div className="w-28 h-28 mx-auto rounded-full border-4 border-black flex flex-col items-center justify-center p-2">
          <span className="text-[10px] font-black uppercase">COLOR ME!</span>
          <span className="text-2xl">★ ★ ★</span>
          <span className="text-[9px] font-bold">OFFICIAL SEAL</span>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 px-12 pt-6">
          <div className="border-t-2 border-black pt-1 text-xs font-bold">
            Parent / Teacher Signature
          </div>
          <div className="border-t-2 border-black pt-1 text-xs font-bold">
            Artist's Signature
          </div>
        </div>

        <div className="text-xs text-gray-400 pb-2">
          Certified by ColorCraft • Keep on creating!
        </div>
      </div>
    </div>
  );
};
