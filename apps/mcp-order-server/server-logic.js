import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// TODO: PHASE 2.1 - Initialize the MCP server
// Requirements:
// 1. Create a new McpServer instance
// 2. Configure the server with appropriate name and version metadata
// 3. Export the server instance for use in other files
export const server = undefined;

// Define a tool to fetch all product orders from the fulfillment service
server.tool("getOrders", "Get product orders", async () => {
  console.error("Fetching orders");
  const res = await fetch("http://localhost:8080/orders");
  const orders = await res.json();

  return { content: [{ type: "text", text: JSON.stringify(orders) }] };
});

// TODO: PHASE 2.2 - Implement the getInventory tool
// Requirements:
// 1. Define a tool named "getInventory" with description "Get product inventory"
// 2. Make an async HTTP GET request to "http://localhost:8080/inventory"
// 3. Parse the JSON response
// 4. Return the inventory data in the required MCP content format
// 5. The tool should be async and handle any potential errors

// TODO: PHASE 2.3 - Implement the purchase tool
// Requirements:
// 1. Define a tool named "purchase" with description "Purchase a product"
// 2. Define input validation schema using Zod:
//    - items: array of objects with guitarId (number) and quantity (number)
//    - customerName: string
// 3. Make an async HTTP POST request to "http://localhost:8080/purchase"
// 4. Send the validated items and customerName in the request body
// 5. Parse the JSON response
// 6. Return the order data in the required MCP content format
// 7. The tool should be async and handle any potential errors
