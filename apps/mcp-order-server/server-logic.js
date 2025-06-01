import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Initialize the MCP server with name and version metadata
export const server = new McpServer({
  name: "Fulfillment MCP Server",
  version: "1.0.0",
});

// Define a tool to fetch all product orders from the fulfillment service
server.tool("getOrders", "Get product orders", async () => {
  console.error("Fetching orders");
  const res = await fetch("http://localhost:8080/orders");
  const orders = await res.json();

  return { content: [{ type: "text", text: JSON.stringify(orders) }] };
});

// Define a tool to fetch current inventory levels from the fulfillment service
server.tool("getInventory", "Get product inventory", async () => {
  console.error("Fetching inventory");
  const res = await fetch("http://localhost:8080/inventory");
  const inventory = await res.json();

  return { content: [{ type: "text", text: JSON.stringify(inventory) }] };
});

// Define a tool to process product purchases with validation for items and customer details
server.tool(
  "purchase",
  "Purchase a product",
  {
    items: z
      .array(
        z.object({
          guitarId: z.number().describe("ID of the guitar to purchase"),
          quantity: z.number().describe("Quantity of guitars to purchase"),
        })
      )
      .describe("List of guitars to purchase"),
    customerName: z.string().describe("Name of the customer"),
  },
  async ({ items, customerName }) => {
    console.error("Purchasing", { items, customerName });
    const res = await fetch("http://localhost:8080/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        customerName,
      }),
    });
    const order = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(order) }] };
  }
);
