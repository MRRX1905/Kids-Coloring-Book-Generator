import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// 1. Plan 5 distinct coloring book pages and cover concept
app.post("/api/gemini/plan-book", async (req, res) => {
  try {
    const { theme, childName, ageGroup = "3-8" } = req.body;

    if (!theme) {
      return res.status(400).json({ error: "Theme is required" });
    }

    const prompt = `You are a professional children's coloring book author and illustrator.
Create a plan for a 5-page personalized coloring book for a child named "${childName || "Little Explorer"}" with the theme "${theme}".
Target age group: ${ageGroup} years old.

Requirements:
- An exciting book title featuring the child's name (e.g., "${childName || "Leo"}'s Epic Space Dinosaur Adventure")
- A fun subtitle or dedication
- Exactly 5 distinct, sequential coloring scenes that tell a lighthearted mini-story
- For each page:
  - Page title (e.g. "Page 1: Blast Off Dino")
  - A short rhyming or joyful story caption (1-2 sentences)
  - Detailed image prompt optimized for black and white, thick-line art coloring page (thick bold outlines, clean vector style, pure black lines on white background, no shading, no gray fills, easy for kids to color)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookTitle: { type: Type.STRING, description: "Personalized title for the book" },
            subtitle: { type: Type.STRING, description: "Catchy subtitle or theme line" },
            coverScenePrompt: {
              type: Type.STRING,
              description: "Prompt for a grand cover illustration featuring the theme and child excitement",
            },
            pages: {
              type: Type.ARRAY,
              description: "List of exactly 5 coloring pages",
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING },
                  suggestedPalette: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-4 fun crayon colors to recommend for this page",
                  },
                },
                required: ["pageNumber", "title", "caption", "imagePrompt"],
              },
            },
          },
          required: ["bookTitle", "subtitle", "coverScenePrompt", "pages"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in plan-book:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate coloring book outline",
    });
  }
});

// 2. Generate Coloring Page Line Art Image using gemini-3-pro-image-preview
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      imageSize = "1K", // "1K" | "2K" | "4K"
      aspectRatio = "3:4", // "3:4" (ideal for coloring book printable page) or "1:1"
      isCover = false,
      childName = "",
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required" });
    }

    // Enforce strict children's coloring book line art style
    const coloringBookStyleInstruction = `Children's coloring book page, bold thick black line art, pure black outlines on clean white background, completely empty white coloring spaces with zero fill, no grayscale, no pencil sketches, no drop shadows, no shading, no hatching, ultra-clean vector outline art, high contrast printable illustration for preschool and elementary kids to color with crayons or markers. High quality, crisp lines. Scene: ${prompt}`;

    console.log(`Generating image with gemini-3-pro-image-preview at ${imageSize} resolution...`);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          {
            text: coloringBookStyleInstruction,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as "1K" | "2K" | "4K",
        },
      },
    });

    let imageUrl = "";
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || "image/png";
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "Model did not return image data. Please try again with a revised prompt.",
      });
    }

    return res.json({ imageUrl, imageSize, prompt });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate coloring page image",
    });
  }
});

// 3. Multi-turn Chatbot using gemini-3.8-flash
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, childName, theme } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const systemInstruction = `You are "Doodle Pal", a warm, enthusiastic, and wonderfully creative children's coloring book artist and story wizard.
Your goal is to assist children and parents in creating custom coloring books.
Current book context:
- Child Name: ${childName || "our little creator"}
- Theme: ${theme || "not specified yet"}

You can help with:
1. Brainstorming exciting themes (e.g., "Underwater Unicorn Castle", "Outer Space Safari", "Dino Bakery")
2. Designing 5 creative page ideas with funny, adventurous storylines
3. Composing catchy rhyming verses or cheerful captions for specific pages
4. Recommending vibrant crayon and pencil color schemes
5. Providing fun coloring tips for toddlers, preschoolers, and young artists

Tone: Friendly, imaginative, kid-accessible, encouraging, and structured with clean bullet points or short fun paragraphs. Use light playful emojis.`;

    // Format chat history for ai.chats
    // messages: array of { role: 'user' | 'model', content: string }
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      history: history.length > 0 ? history : undefined,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: lastMessage.content || "Hello!",
    });

    return res.json({ reply: response.text || "Let's make an amazing coloring book!" });
  } catch (error: any) {
    console.error("Error in chat:", error);
    return res.status(500).json({
      error: error?.message || "Chatbot encountered an error. Please try again.",
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ColorCraft server running on http://0.0.0.0:${PORT} (${isDev ? "development" : "production"})`);
  });
}

startServer();
