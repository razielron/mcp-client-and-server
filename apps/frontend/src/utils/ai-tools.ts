import { experimental_createMCPClient, tool } from "ai";
import { z } from "zod";

import { fetchGuitars } from "./apis";

// TODO: PHASE 3.1 - Initialize the MCP client
// Requirements:
// 1. Create a new MCP client using experimental_createMCPClient
// 2. Configure the client with:
//    - transport type: "sse"
//    - URL: "http://localhost:8081/sse"
//    - name: "Order Service"
// 3. Store the client instance in the mcpClient variable

// TODO: PHASE 1.1 - Implement the getProducts tool
// Requirements:
// 1. Create a tool using the 'tool' function with description "Get all products from the database"
// 2. Define input validation using Zod:
//    - Use z.object() to define the parameter structure
//    - Since this tool doesn't need parameters, use an empty object
// 3. The tool should be async and handle any potential errors
// 4. Store the tool in the getProducts constant

const recommendGuitar = tool({
  description: "Use this tool to recommend a guitar to the user",
  parameters: z.object({
    id: z.string().describe("The id of the guitar to recommend"),
  }),
});

// TODO: PHASE 1.2 - Implement the getTools function
// Requirements:
// 1. Return an object that combines:
//    - The tools from the MCP client
//    - The local tools (getProducts and recommendGuitar)
// 2. The function should handle any potential errors
export default async function getTools() {
  return {
    recommendGuitar,
  };
}

// TODO: PHASE 3.2 - Fetch MCP client tools
// Requirements:
// 1. Use mcpClient.tools() to fetch available tools from the MCP client
// 2. This should be done after the client is initialized and before using the tools
