import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server-logic.js";

// Create server instance
const server = createServer();

// Initialize a new stdio transport instance for handling server communication
const transport = new StdioServerTransport();
// Connect the server to the transport layer to enable communication
await server.connect(transport);
