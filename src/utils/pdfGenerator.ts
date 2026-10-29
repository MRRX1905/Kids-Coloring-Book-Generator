import { jsPDF } from "jspdf";
import { ColoringBookData } from "../types";

/**
 * Generates and downloads a complete multi-page PDF coloring book
 */
export async function generateColoringBookPDF(book: ColoringBookData): Promise<void> {
  // A4 dimensions: 210 x 297 mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Helper for drawing decorative double border
  const drawPageBorder = (showCornerStars = true) => {
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(1.2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.4);
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

    if (showCornerStars) {
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text("★", 11.5, 12.5);
      doc.text("★", pageWidth - 14.5, 12.5);
      doc.text("★", 11.5, pageHeight - 11.5);
      doc.text("★", pageWidth - 14.5, pageHeight - 11.5);
    }
  };

  // ==========================================
  // PAGE 1: COVER
  // ==========================================
  drawPageBorder(true);

  // Top banner: Child's Personalization
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `A PERSONALIZED COLORING ADVENTURE FOR`,
    pageWidth / 2,
    28,
    { align: "center" }
  );

  // Big Child Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(20, 20, 20);
  doc.text(book.childName.toUpperCase(), pageWidth / 2, 40, { align: "center" });

  // Book Title
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  const titleLines = doc.splitTextToSize(book.bookTitle || `${book.childName}'s Coloring Book`, contentWidth);
  doc.text(titleLines, pageWidth / 2, 54, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const subtitleY = 56 + titleLines.length * 7;
  const subtitleLines = doc.splitTextToSize(book.subtitle || `Theme: ${book.theme}`, contentWidth - 20);
  doc.text(subtitleLines, pageWidth / 2, subtitleY, { align: "center" });

  // Cover Image (if available) or Cover Page Image
  const coverImage = book.coverImageUrl || book.pages[0]?.imageUrl;
  const coverImgY = subtitleY + 12;
  const coverImgHeight = 115;
  const coverImgWidth = 115 * (3 / 4); // portrait 3:4 ratio

  if (coverImage) {
    try {
      const imgX = (pageWidth - coverImgWidth) / 2;
      // Border around cover image
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.8);
      doc.rect(imgX - 1, coverImgY - 1, coverImgWidth + 2, coverImgHeight + 2);

      doc.addImage(coverImage, "PNG", imgX, coverImgY, coverImgWidth, coverImgHeight);
    } catch (e) {
      console.warn("Could not render cover image into PDF", e);
    }
  } else {
    // Placeholder decorative coloring book icon / frame
    const imgX = (pageWidth - coverImgWidth) / 2;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.8);
    doc.rect(imgX, coverImgY, coverImgWidth, coverImgHeight);
    doc.setFontSize(14);
    doc.setTextColor(120, 120, 120);
    doc.text("Cover Artwork", pageWidth / 2, coverImgY + 55, { align: "center" });
  }

  // "This Book Belongs To" Fill-in Box for kids
  const boxY = 228;
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.6);
  doc.roundedRect(pageWidth / 2 - 60, boxY, 120, 28, 3, 3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("THIS COLORING BOOK BELONGS TO:", pageWidth / 2, boxY + 7, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(10, 10, 10);
  doc.text(book.childName, pageWidth / 2, boxY + 16, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Artist Age: __________   •   Date Started: __________", pageWidth / 2, boxY + 23, {
    align: "center",
  });

  // Footer notes
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text("Created with ColorCraft • Printed for endless imagination!", pageWidth / 2, 282, {
    align: "center",
  });

  // ==========================================
  // PAGES 2 - 6: 5 COLORING PAGES
  // ==========================================
  for (let i = 0; i < book.pages.length; i++) {
    const page = book.pages[i];
    doc.addPage("a4", "portrait");
    drawPageBorder(false);

    // Top Header: Small child name & theme
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(
      `${book.childName.toUpperCase()}'S COLORING BOOK  •  ${book.theme.toUpperCase()}`,
      pageWidth / 2,
      20,
      { align: "center" }
    );

    // Page Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(20, 20, 20);
    const pageTitle = page.title || `Page ${i + 1}`;
    doc.text(pageTitle, pageWidth / 2, 29, { align: "center" });

    // Coloring Art Image Box
    const artWidth = 150;
    const artHeight = 180; // 3:4 or ~1:1.2
    const artX = (pageWidth - artWidth) / 2;
    const artY = 34;

    if (page.imageUrl) {
      try {
        // Crisp black outline around the coloring page canvas
        doc.setDrawColor(40, 40, 40);
        doc.setLineWidth(0.8);
        doc.rect(artX, artY, artWidth, artHeight);

        doc.addImage(page.imageUrl, "PNG", artX, artY, artWidth, artHeight);
      } catch (err) {
        console.warn(`Could not add image for page ${i + 1}`, err);
        doc.setDrawColor(180, 180, 180);
        doc.rect(artX, artY, artWidth, artHeight);
        doc.setFontSize(12);
        doc.setTextColor(150, 150, 150);
        doc.text(`[Coloring Page ${i + 1} Image]`, pageWidth / 2, artY + 90, { align: "center" });
      }
    } else {
      doc.setDrawColor(180, 180, 180);
      doc.rect(artX, artY, artWidth, artHeight);
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`[Coloring Page ${i + 1} Image]`, pageWidth / 2, artY + 90, { align: "center" });
    }

    // Story Caption at bottom
    if (page.caption) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      const captionLines = doc.splitTextToSize(page.caption, contentWidth - 10);
      doc.text(captionLines, pageWidth / 2, 224, { align: "center" });
    }

    // Fun crayon dots reminder
    if (page.suggestedPalette && page.suggestedPalette.length > 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text(
        `Suggested Crayon Colors: ${page.suggestedPalette.join("  •  ")}`,
        pageWidth / 2,
        242,
        { align: "center" }
      );
    }

    // Page Number Footer
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `— Page ${i + 1} of ${book.pages.length} —`,
      pageWidth / 2,
      280,
      { align: "center" }
    );
  }

  // ==========================================
  // PAGE 7: BONUS ARTIST CERTIFICATE
  // ==========================================
  doc.addPage("a4", "portrait");
  drawPageBorder(true);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(100, 100, 100);
  doc.text("OFFICIAL COLORING BOOK DIPLOMA", pageWidth / 2, 45, { align: "center" });

  doc.setFontSize(26);
  doc.setTextColor(20, 20, 20);
  doc.text("MASTER ARTIST AWARD", pageWidth / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text("This certificate is proudly awarded to", pageWidth / 2, 85, { align: "center" });

  // Big Underlined Child Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(10, 10, 10);
  doc.text(book.childName, pageWidth / 2, 105, { align: "center" });
  doc.setLineWidth(1.2);
  doc.setDrawColor(40, 40, 40);
  doc.line(pageWidth / 2 - 50, 110, pageWidth / 2 + 50, 110);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  const certLines = doc.splitTextToSize(
    `for extraordinary imagination, brilliant color choices, and fantastic artistic dedication in completing the entire "${book.bookTitle || book.theme}" coloring book!`,
    contentWidth - 20
  );
  doc.text(certLines, pageWidth / 2, 125, { align: "center" });

  // Coloring Star Badge for the child to color in!
  const badgeY = 160;
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(1.5);
  doc.circle(pageWidth / 2, badgeY, 22);
  doc.setLineWidth(0.6);
  doc.circle(pageWidth / 2, badgeY, 19);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("COLOR ME!", pageWidth / 2, badgeY - 5, { align: "center" });
  doc.setFontSize(18);
  doc.text("★ ★ ★", pageWidth / 2, badgeY + 4, { align: "center" });
  doc.setFontSize(8);
  doc.text("OFFICIAL STAMP", pageWidth / 2, badgeY + 11, { align: "center" });

  // Signatures
  const sigY = 220;
  doc.setLineWidth(0.6);
  doc.setDrawColor(80, 80, 80);
  doc.line(35, sigY, 90, sigY);
  doc.line(pageWidth - 90, sigY, pageWidth - 35, sigY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("Proud Parent / Teacher Signature", 62.5, sigY + 6, { align: "center" });
  doc.text("Artist's Official Signature", pageWidth - 62.5, sigY + 6, { align: "center" });

  // Save the PDF
  const safeFilename = `${book.childName || "My"}_${book.theme || "Coloring"}_Book.pdf`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase();

  doc.save(safeFilename);
}
