"use client";

import dynamic from "next/dynamic";

// Loaded separately so the chat code never slows down the first paint
const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

export default function ChatbotLoader() {
  return <Chatbot />;
}
