import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type CoreMessage, type ToolSet } from "ai";

import getTools from "./ai-tools";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SystemPromptConfig {
  value: string;
  enabled: boolean;
}

interface AIRequestData {
  messages: Array<Message>;
  systemPrompt?: SystemPromptConfig;
}

const SYSTEM_PROMPT = `You are an AI for a music store.

There are products available for purchase. You can recommend a product to the user.
You can get a list of products by using the getProducts tool.

You also have access to a fulfillment server that can be used to purchase products.
You can get a list of products by using the getInventory tool.
You can purchase a product by using the purchase tool.

After purchasing a product tell the customer they've made a great choice and their order will be processed soon and they will be playing their new guitar in no time.
`;

// Configure OpenAI client
const openaiProvider = createOpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const openaiClient = openaiProvider("gpt-4-turbo");

function filterValidMessages(messages: Array<Message>): Array<CoreMessage> {
  return messages
    .filter(
      (msg) =>
        msg.content.trim() !== "" &&
        !msg.content.startsWith("Sorry, I encountered an error")
    )
    .map((msg) => ({
      role: msg.role,
      content: msg.content.trim(),
    }));
}

function handleAIError(error: unknown): Response {
  console.error("Error in genAIResponse:", error);
  const errorMessage = error instanceof Error && error.message.includes("rate limit")
    ? "Rate limit exceeded. Please try again in a moment."
    : error instanceof Error 
      ? error.message 
      : "Failed to get AI response";
  
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

async function generateAIResponseStream(
  messages: Array<CoreMessage>,
  tools: ToolSet
) {
  return streamText({
    model: openaiClient,
    messages,
    system: SYSTEM_PROMPT,
    maxSteps: 20,
    tools,
  });
}

export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
  .validator((data: AIRequestData) => data)
  .handler(async ({ data }) => {
    console.log(JSON.stringify({ messages: data.messages }));

    const filteredMessages = filterValidMessages(data.messages);
    const tools = await getTools();

    try {
      const result = await generateAIResponseStream(filteredMessages, tools as ToolSet);
      return result.toDataStreamResponse();
    } catch (error) {
      return handleAIError(error);
    }
  });
