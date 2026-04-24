**Status:** Active | **Phase:** v1.0.0 | **Last Sprint:** BRAIN-SESSION-01 | **Last Updated:** 2026-04-23

brain-mcp is a standalone MCP server exposing 5 brain.db intelligence tools: brain_briefing, brain_recall, brain_recall_graph, brain_remember, brain_status. Extracted from KERNL MCP (BRAIN-SESSION-01) to decouple brain.db schema evolution from KERNL's release cycle. Uses the same createRequire/better-sqlite3 pattern, degrades gracefully to BM25-only if Ollama is unavailable.

Build: ✅ TSC 0 errors (TypeScript 6, moduleResolution: bundler) | dist/index.js present
Config: see claude_desktop_config_snippet.json — add to claude_desktop_config.json to activate.
KERNL brain tools remain active until David switches config.
