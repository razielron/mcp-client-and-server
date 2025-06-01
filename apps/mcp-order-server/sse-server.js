import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { server } from "./server-logic.js";

// Initialize Express application
const app = express();

// Store the SSE transport instance for message handling
let transport;

// SSE endpoint that establishes a server-sent events connection
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

// Message endpoint that handles incoming messages from clients
app.post("/messages", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

// Configure and start the server on the specified port
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`MCP SSE Server is running on http://localhost:${port}/sse`);
});
