import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { Tool, ToolSet } from "ai";

import getTools from "./ai-tools";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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

console.log({ openaikey: process.env.VITE_OPENAI_API_KEY });

const openaiClient = openaiProvider("gpt-4-turbo");

export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
  .validator(
    (d: {
      messages: Array<Message>;
      systemPrompt?: { value: string; enabled: boolean };
    }) => d
  )
  .handler(async ({ data }) => {
    const messages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== "" &&
          !msg.content.startsWith("Sorry, I encountered an error")
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

    const tools = await getTools();
    console.log({ tools });

    try {
      const result = streamText({
        model: openaiClient,
        messages,
        system: SYSTEM_PROMPT,
        maxSteps: 20,
        tools,
      });

      const response = await result.toDataStreamResponse();
      
      return response;
    } catch (error) {
      console.error("Error in genAIResponse:", error);
      const errorMessage = error instanceof Error && error.message.includes("rate limit")
        ? "Rate limit exceeded. Please try again in a moment."
        : error instanceof Error ? error.message : "Failed to get AI response";
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });
