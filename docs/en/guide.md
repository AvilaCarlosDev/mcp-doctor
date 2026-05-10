# mcp-doctor Guide 🩺

`mcp-doctor` is a CLI for diagnosing MCP servers before connecting them to AI agents.

## Goal

Help developers and maintainers quickly answer:

- Does the MCP server start correctly?
- Does it expose tools?
- Are tool names unique and safe?
- Are descriptions useful for agents?
- Are schemas well-formed?
- Are there security or design warnings?

## Local installation

```bash
git clone https://github.com/AvilaCarlosDev/mcp-doctor.git
cd mcp-doctor
npm install
npm run build
```

## Quick usage

```bash
npm run dev -- check --cmd node --args examples/echo-server.mjs
```

Or with config:

```bash
npm run dev -- init
npm run dev -- check --server echo
```

## Reports

### Markdown

```bash
npm run dev -- check --server echo --markdown report.md
```

### JSON

```bash
npm run dev -- check --server echo --json
```

## MCP best practices covered

1. **Clean stdout:** stdio servers must reserve stdout for JSON-RPC messages. Logs should go to stderr.
2. **Descriptive tools:** agents make better decisions when each tool clearly explains what it does.
3. **Clear schemas:** `inputSchema` should be a valid and understandable JSON Schema object.
4. **Honest annotations:** destructive tools should be marked as destructive; read-only tools should be marked as read-only.
5. **Reproducible reports:** every diagnosis can be exported for issues, PRs, or documentation.

## Philosophy

This project does not replace the MCP Inspector. It complements the workflow with a fast, automatable diagnostic that can eventually run in CI.
