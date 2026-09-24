"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI request failed.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `⚠️ ${error.message}`
              : "⚠️ Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="chatPage">
      <header className="chatHeader">
        <div>
          <strong>AKHIL NEURAL CORE X</strong>
          <span>● Online</span>
        </div>
      </header>

      <section className="chatArea">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="coreIcon">✦</div>

            <h1>How can I help, Akhil?</h1>

            <p>
              Ask anything. Build, code, create, learn or explore.
            </p>
          </div>
        ) : (
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "user"
                    ? "userMessage"
                    : "assistantMessage"
                }`}
              >
                <div className="messageLabel">
                  {message.role === "user" ? "YOU" : "AKHIL AI"}
                </div>

                <div className="messageContent">
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistantMessage">
                <div className="messageLabel">AKHIL AI</div>

                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <form className="composer" onSubmit={sendMessage}>
        <button
          type="button"
          className="toolButton"
          title="Attach"
        >
          +
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AKHIL AI..."
          rows={1}
          disabled={loading}
        />

        <button
          type="button"
          className="toolButton voiceButton"
          title="Voice"
        >
          ◉
        </button>

        <button
          type="submit"
          className="sendButton"
          disabled={!input.trim() || loading}
          title="Send"
        >
          ↑
        </button>
      </form>
    </main>
  );
          }
