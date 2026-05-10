# MCP Doctor Report

- **Status:** healthy
- **Target:** `node examples/echo-server.mjs`
- **Tools:** 1
- **Checks:** 5 passed · 0 warnings · 0 failed

## Tools

### echo

Return the provided message. Useful for smoke testing MCP clients.

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "description": "Message to return"
    }
  },
  "required": ["message"],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

## Checks

- **PASS** — Connection: MCP server initialized successfully.
- **PASS** — Capabilities: Server capabilities were received during initialization.
- **PASS** — Tools available: The server exposes 1 tool.
- **PASS** — Unique tool names: All tool names are unique.
- **PASS** — Tool descriptions: All tools include useful descriptions.
- **INFO** — Stdio stdout hygiene: For stdio MCP servers, logs should go to stderr. stdout must be reserved for JSON-RPC messages.
- **INFO** — Review tool side effects: Review tools with destructive side effects and add accurate annotations such as readOnlyHint, destructiveHint and idempotentHint.
