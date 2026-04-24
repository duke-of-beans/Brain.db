/**
 * brain-mcp — Standalone MCP server for brain.db intelligence
 * Version: 1.0.0
 *
 * Extracted from KERNL MCP (BRAIN-SESSION-01).
 * Decouples brain.db schema evolution from KERNL's release cycle.
 * 5 tools: brain_briefing, brain_recall, brain_recall_graph, brain_remember, brain_status
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { brainTools, createBrainHandlers } from './tools/brain-tools.js';

const server = new Server(
  { name: 'brain-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const handlers = createBrainHandlers();

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: brainTools }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const handler = handlers[name];
  if (!handler) {
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: 'Unknown tool: ' + name }) }],
      isError: true,
    };
  }
  try {
    const result = await handler((args || {}) as Record<string, unknown>);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: (e as Error).message }) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[brain-mcp] Running — 5 brain tools');
