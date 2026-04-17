"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Chatbot = dynamic(() => import("./common/Chatbot"), {
  ssr: false,
});

export default function ClientWrapper({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Chatbot />
      {children}
    </ThemeProvider>
  );
}
