import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { z } from "zod";
import { tool } from "ai";

import { fetchGuitars } from "./apis";
console.log("start init mcp client");

// Initialize the MCP client with metadata about our service
// This information is used for logging and debugging purposes
const client = new Client({
  name: "Order Service",
  version: "1.0.0"
});
console.log("mcp client created");

// Create a Streamable HTTP transport connection to the MCP server
// This is the modern, recommended transport method that supports bidirectional communication
const transport = new StreamableHTTPClientTransport(new URL("http://localhost:8081/mcp"));
console.log("transport created");
// Establish the connection with the MCP server
await client.connect(transport);
console.log("mcp client connected");

// Define a tool that fetches all products from our database
// This tool will be available to the AI model through the MCP protocol
const getProducts = tool({
  description: "Get all products from the database",
  parameters: z.object({}),
  execute: async () => await fetchGuitars(),
});

// Define a tool for guitar recommendations
// The AI model can use this tool to suggest guitars to users
// This tool is used on the UI side
const recommendGuitar = tool({
  description: "Use this tool to recommend a guitar to the user",
  parameters: z.object({
    id: z.string().describe("The id of the guitar to recommend"),
  })
});

export default async function getTools() {
  console.log("getTools");
  const serverTools = await client.listTools();
  console.log({ serverTools: serverTools.tools });

  // Convert server tools from array-like object to proper object structure
  const transformedServerTools = Object.values(serverTools.tools).reduce((acc, serverTool: any) => {
    console.log({ singleServerToolParams: serverTool?.inputSchema?.properties });
    
    // Convert server tool parameters to Zod schema
    const zodSchema = Object.entries(serverTool?.inputSchema?.properties || {}).reduce((schema, [key, value]: [string, any]) => {
      if (value.type === 'string') {
        schema[key] = z.string().describe(value.description || '');
      } else if (value.type === 'array') {
        schema[key] = z.array(z.any()).describe(value.description || '');
      }
      return schema;
    }, {} as Record<string, any>);

    const zodObject = z.object(zodSchema);
    
    acc[serverTool.name] = tool({
      description: serverTool.description,
      parameters: zodObject,
      execute: async (args: z.infer<typeof zodObject>) => {
        console.log("executing tool", serverTool.name, {args});
        const response: any = await client.callTool({
          name: serverTool.name,
          arguments: args
        });
        console.log({ response });
        console.log({ response: response.content?.[0]?.text });
        return response.content?.[0]?.text || "No response from server";
      }
    });
    return acc;
  }, {} as Record<string, any>);

  return {
    ...transformedServerTools,
    getProducts,
    recommendGuitar,
  };
}
