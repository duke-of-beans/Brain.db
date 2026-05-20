# Brain.db

Persistent memory database for AI systems. MCP server exposing intelligence tools over a SQLite-backed knowledge store with full-text search, vector embeddings, and graph traversal.

## Tools

| Tool | What it does |
|------|-------------|
| `brain_briefing` | Portfolio-wide delta — surfaces priority items, changed signals, recent observations |
| `brain_recall` | 3-signal RRF hybrid search. Fuses vector cosine similarity, BM25 keyword matching, and semantic re-ranking |
| `brain_recall_graph` | Graph-enhanced recall. Seeds via hybrid search, then walks edges to surface connected observations |
| `brain_remember` | Write an observation. Auto-embedded, SHA-256 dedup guard prevents duplicates |
| `brain_status` | Entity details, recent observations, latest signal for a named project or concept |

## Architecture

SQLite in WAL mode. Three retrieval signals fused via Reciprocal Rank Fusion:

1. **Vector cosine** — nomic-embed-text (768-dim, via Ollama) for semantic similarity
2. **BM25** — FTS5 full-text search for keyword matching
3. **MiniLM re-rank** — all-MiniLM-L6-v2 (384-dim, ONNX) for cross-encoder style re-ranking

Degrades gracefully: if Ollama is unavailable, falls back to BM25-only. If MiniLM is unavailable, falls back to 2-signal fusion.

## Schema

- **observations** — timestamped knowledge units with embeddings, grounding tiers, access tracking
- **entities** — named projects, people, concepts with type classification
- **brain_edges** — weighted relationships between entities (upstream, downstream, co_mentioned, structural_isomorphism)
- **brain_signals** — typed status signals per entity (health, priority, blockers)
- **content_hash** — SHA-256 deduplication guard on all observations

## Retrieval tracking

Every recall query updates `last_accessed_at` and `access_count` on returned observations. This feeds an ACT-R inspired decay model — frequently accessed observations maintain activation, rarely accessed ones decay over time. Anti-Hebbian pruning removes observations that consistently fail to surface in relevant queries.

## Setup

```bash
npm install
npm run build
```

Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "brain": {
      "command": "node",
      "args": ["path/to/dist/index.js"]
    }
  }
}
```

Requires a brain.db SQLite database with the schema above. See the [cognitive-stack](https://github.com/duke-of-beans/cognitive-stack) repo for full architecture documentation.

## License

MIT