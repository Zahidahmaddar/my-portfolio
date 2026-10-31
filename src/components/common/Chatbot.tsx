"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, MessageCircle, RotateCcw, X } from "lucide-react";
import ChatMarkdown from "./ChatMarkdown";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  failed?: boolean;
}

const STORAGE_KEY = "chat-messages";
const MAX_LENGTH = 1000;
const FAILED_REPLY = "That question didn't go through. Try again, or use the contact form.";

const SUGGESTIONS = [
  "What has Zahid built?",
  "What does he work with?",
  "How can I contact him?",
];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "waiting" | "streaming">("idle");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wasOpen = useRef(false);
  const reduceMotion = useReducedMotion();
  const isBusy = status !== "idle";

  // Keep the conversation when the visitor reloads during this visit
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // Start with an empty conversation
    }
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (isBusy) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // The conversation just won't survive a reload
    }
  }, [messages, isBusy]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, status, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else if (wasOpen.current) {
      launcherRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const ask = async (question: string, history: Message[]) => {
    if (!question || isBusy) return;

    const assistantId = newId();
    setMessages([...history, { id: newId(), content: question, role: "user" }]);
    setStatus("waiting");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: question,
          conversationHistory: history
            .filter((m) => !m.failed)
            .slice(-8)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || FAILED_REPLY);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const content = reply;
        setStatus("streaming");
        setMessages((current) => {
          const others = current.filter((m) => m.id !== assistantId);
          return [...others, { id: assistantId, content, role: "assistant" }];
        });
      }

      if (!reply.trim()) throw new Error(FAILED_REPLY);
    } catch (error) {
      if (controller.signal.aborted) return;
      const content = error instanceof Error && error.name !== "TypeError" ? error.message : FAILED_REPLY;
      setMessages((current) => {
        const others = current.filter((m) => m.id !== assistantId);
        return [...others, { id: assistantId, content, role: "assistant", failed: true }];
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setStatus("idle");
      }
    }
  };

  const send = (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || isBusy) return;
    setInput("");
    ask(question, messages);
    inputRef.current?.focus();
  };

  // Ask the failed question again, dropping its error reply from the conversation
  const retry = () => {
    const failedIndex = messages.findLastIndex((m) => m.failed);
    const question = messages[failedIndex - 1];
    if (failedIndex < 1 || question?.role !== "user") return;
    ask(question.content, messages.slice(0, failedIndex - 1));
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setStatus("idle");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <>
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 btn !rounded-full bg-ink text-surface hover:opacity-90 shadow-[var(--shadow-pop)]"
        >
          <MessageCircle size={16} />
          Ask about Zahid
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Ask about Zahid"
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsOpen(false);
            }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed z-50 inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[23rem] sm:h-[min(34rem,calc(100dvh-3rem))] flex flex-col bg-raised text-ink sm:rounded-2xl sm:border sm:border-line shadow-[var(--shadow-pop)] overflow-hidden"
          >
            <div className="flex items-center justify-between pl-4 pr-2 py-2 border-b border-line">
              <h2 className="font-semibold">Ask about Zahid</h2>
              <div className="flex items-center">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Start a new conversation"
                    title="Start a new conversation"
                    className="icon-btn"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="icon-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={isBusy}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3"
            >
              {messages.length === 0 && (
                <div>
                  <p className="text-muted">
                    I can answer questions about Zahid&apos;s projects, skills and
                    how to reach him.
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="chip hover:bg-sunken transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  {message.role === "user" ? (
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-action text-on-action px-3.5 py-2 leading-snug whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div
                      className={`max-w-[90%] leading-snug break-words ${
                        message.failed
                          ? "text-danger font-medium"
                          : status === "streaming" && message === lastMessage
                            ? "chat-caret"
                            : ""
                      }`}
                    >
                      <ChatMarkdown text={message.content} />
                      {message.failed && message === lastMessage && (
                        <button
                          type="button"
                          onClick={retry}
                          disabled={isBusy}
                          className="btn btn-quiet btn-sm mt-2 text-ink"
                        >
                          Ask again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {status === "waiting" && (
                <p className="typing py-1">
                  <span />
                  <span />
                  <span />
                  <span className="sr-only">Writing a reply</span>
                </p>
              )}
            </div>

            <div className="px-3 pt-3 pb-2 border-t border-line">
              <div className="flex items-end gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  maxLength={MAX_LENGTH}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question"
                  className="field resize-none max-h-28 !rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={!input.trim() || isBusy}
                  aria-label="Send question"
                  className="btn btn-primary !px-3 !rounded-xl shrink-0"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs text-muted">
                AI-generated answers can be wrong. Check anything important with
                Zahid.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
