import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { createServer } from "./server-logic.js";

const app = express();
app.use(express.json());

// Handle Streamable HTTP connection requests
app.all("/mcp", async (req, res) => {
  console.log(`[${new Date().toISOString()}] MCP request received`);
  
  // Create a new server instance for each request to ensure isolation
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on('close', () => {
    console.log('Request closed');
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Set server port from environment variable or default to 8081
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`MCP Streamable HTTP Server is running on http://localhost:${port}/mcp`);
});
