import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =
  "You are QCI AGI, a concise and practical AI agent. Give direct answers and clear next steps.";

function extractText(blocks: Anthropic.Messages.Message["content"]): string {
  return blocks
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { role?: unknown; content?: unknown };

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const inputMessages = body?.messages;

    if (!Array.isArray(inputMessages) || inputMessages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required." },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = inputMessages
      .filter(isChatMessage)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 4000),
      }))
      .filter((message) => message.content.length > 0)
      .slice(-20);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages to process." },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = extractText(response.content);

    return NextResponse.json({
      reply: reply || "Claude returned an empty response.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
