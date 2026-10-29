import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Bot, User, Wand2, Lightbulb } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  theme: string;
  onApplyTheme: (theme: string) => void;
  onApplyCaption?: (pageIndex: number, caption: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Suggest 5 awesome scene ideas for our theme!",
  "Write a funny rhyming caption for our coloring page",
  "Recommend a vibrant 4-color crayon palette",
  "Give me 3 magical themes for a 6-year-old",
];

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  isOpen,
  onClose,
  childName,
  theme,
  onApplyTheme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi there! I'm **Doodle Pal**, your creative coloring book co-creator! 🎨✨\n\nI can help you brainstorm imaginative themes, draft hilarious story captions, or pick fun crayon colors for **${
        childName || "your little artist"
      }**.\n\nWhat kind of coloring adventure would you like to invent today?`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
          childName,
          theme,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch chat response");
      }

      const botMessage: ChatMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: data.reply || "I'd love to help with your coloring book!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: "error-" + Date.now(),
        role: "assistant",
        content: `Oops! I had a little hiccup thinking: ${err?.message || "Please check your network."}`,
        timestamp: "Now",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl flex flex-col border-l-4 border-amber-300 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-inner">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg tracking-tight">Doodle Pal</h3>
              <span className="text-[10px] uppercase font-bold bg-white/25 px-2 py-0.5 rounded-full tracking-wider">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium">Coloring Story & Brainstorm Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-white/20 transition-colors text-white"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Book Context Banner */}
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-medium">
        <span>
          🎨 Child: <strong className="text-amber-950">{childName || "Not set"}</strong>
        </span>
        <span className="truncate max-w-[180px]">
          Theme: <strong className="text-amber-950">{theme || "None"}</strong>
        </span>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
        {messages.map((m) => {
          const isBot = m.role === "assistant";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  isBot
                    ? "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs"
                    : "bg-amber-600 text-white rounded-tr-xs"
                }`}
              >
                {/* Message Content formatted nicely */}
                <div className="whitespace-pre-wrap font-sans">
                  {m.content.split("\n").map((line, idx) => {
                    // Check for bold highlights or bullet points
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 my-0.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    return <p key={idx} className={line === "" ? "h-2" : "my-0.5"}>{line}</p>;
                  })}
                </div>

                <div
                  className={`text-[10px] mt-1.5 font-medium ${
                    isBot ? "text-stone-400" : "text-amber-200 text-right"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Doodle Pal is sketching ideas...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-2.5 bg-white border-t border-stone-200">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-stone-500 font-semibold px-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Prompts:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {DEFAULT_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="text-xs shrink-0 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 px-3 py-1.5 rounded-full font-medium transition-colors border border-stone-200"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for theme ideas, story rhymes, color palettes..."
          className="flex-1 bg-stone-100 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-all shadow-xs"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
