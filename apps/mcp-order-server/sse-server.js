import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { server } from "./server-logic.js";

// Initialize Express application
const app = express();

// Store the SSE transport instance for message handling
let transport;

// TODO: PHASE 2.4 - Implement the SSE endpoint that establishes a server-sent events connection
// Requirements:
// 1. Create a GET route for "/sse" that handles async requests
// 2. Create a new SSEServerTransport instance with the path "/messages" and the response object
// 3. Store the transport instance in the 'transport' variable
// 4. Connect the server to the transport using server.connect()
// 5. The endpoint should be async and handle the request/response objects

// TODO: PHASE 2.5 - Implement the message handling endpoint
// Requirements:
// 1. Create a POST route for "/messages" that handles async requests
// 2. Use the transport instance to handle the incoming message
// 3. The endpoint should be async and handle the request/response objects
// 4. The transport's handlePostMessage method should be used to process the message

// Configure and start the server on the specified port
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`MCP SSE Server is running on http://localhost:${port}/sse`);
});
