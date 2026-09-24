import { NextResponse } from "next/server";

const NVIDIA_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";

const MODEL = "deepseek-ai/deepseek-v4-flash-0731";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKeys = Object.keys(process.env)
      .filter(
        (key) =>
          key === "NVIDIA_API_KEY" ||
          /^NVIDIA_API_KEY_\d+$/.test(key)
      )
      .sort((a, b) => {
        if (a === "NVIDIA_API_KEY") return -1;
        if (b === "NVIDIA_API_KEY") return 1;

        return (
          Number(b.split("_").pop()) -
          Number(a.split("_").pop())
        );
      })
      .map((key) => process.env[key])
      .filter(Boolean) as string[];

    if (apiKeys.length === 0) {
      return NextResponse.json(
        {
          error:
            "NVIDIA API key is not configured on the server.",
        },
        { status: 500 }
      );
    }

    let lastError = "AI request failed.";

    for (const apiKey of apiKeys) {
      try {
        const response = await fetch(NVIDIA_URL, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            model: MODEL,

            messages: [
              {
                role: "system",
                content:
                  "You are AKHIL NEURAL CORE X, a powerful personal AI assistant. Answer naturally and accurately. Help with coding, learning, writing, reasoning, technology, creativity, and everyday questions. Do not use scripted answers. Match the user's language and keep answers clear unless more detail is requested.",
              },
              {
                role: "user",
                content: message,
              },
            ],

            temperature: 0.7,
            max_tokens: 1200,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const reply =
            data?.choices?.[0]?.message?.content ||
            data?.choices?.[0]?.message?.reasoning_content;

          if (!reply) {
            return NextResponse.json(
              {
                error:
                  "The AI provider returned an empty response.",
              },
              { status: 502 }
            );
          }

          return NextResponse.json({ reply });
        }

        lastError =
          data?.error?.message ||
          "NVIDIA AI request failed.";

        if (
          ![401, 403, 429].includes(response.status) &&
          response.status < 500
        ) {
          break;
        }
      } catch {
        lastError =
          "Network error while contacting NVIDIA.";
      }
    }

    return NextResponse.json(
      { error: lastError },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
