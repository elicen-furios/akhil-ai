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
      .filter((key) => /^NVIDIA_API_KEY_\d+$/.test(key))
      .sort(
        (a, b) =>
          Number(a.split("_").pop()) -
          Number(b.split("_").pop())
      )
      .map((key) => process.env[key])
      .filter(Boolean) as string[];

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "No NVIDIA API keys are configured." },
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
                  "You are AKHIL NEURAL CORE X, a helpful personal AI assistant. Be clear, capable, and concise.",
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
            data?.choices?.[0]?.message?.reasoning_content ||
            "I couldn't generate a response.";

          return NextResponse.json({ reply });
        }

        lastError =
          data?.error?.message || "AI request failed.";

        // Try the next key for authentication, rate-limit,
        // server, or temporary provider failures.
        if (![401, 403, 429].includes(response.status) &&
            response.status < 500) {
          break;
        }
      } catch {
        lastError = "Network error while contacting NVIDIA.";
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
