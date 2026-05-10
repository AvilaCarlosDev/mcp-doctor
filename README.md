# mcp-doctor 🩺

> A bilingual CLI doctor for MCP servers: validate, inspect, smoke test, and report before connecting them to your agents.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-42ffa1.svg)](package.json)
[![MCP](https://img.shields.io/badge/MCP-compatible-ff8c69.svg)](https://modelcontextprotocol.io/)

## Why

The Model Context Protocol ecosystem is growing fast. More tools means more integration issues:

- servers that fail during initialization,
- missing or weak tool descriptions,
- invalid or confusing schemas,
- stdout/stderr mistakes in stdio servers,
- unsafe tool annotations,
- no clear report for humans reviewing the server.

`mcp-doctor` gives developers a fast, repeatable way to inspect MCP servers from the terminal.

## Features

- Connects to MCP servers through stdio.
- Lists tools exposed by the server.
- Validates basic tool catalog quality.
- Checks tool names, duplicate names, descriptions and schemas.
- Adds security-oriented advisories for MCP tool usage.
- Captures recent stderr output for debugging.
- Prints a clean terminal report.
- Exports JSON and Markdown reports.
- Includes English and Spanish documentation.

## Install

```bash
npm install -g mcp-doctor
```

For local development:

```bash
git clone https://github.com/AvilaCarlosDev/mcp-doctor.git
cd mcp-doctor
npm install
npm run build
```

## Quick start

Run against a command directly:

```bash
mcp-doctor check --cmd node --args examples/echo-server.mjs
```

Generate a config file:

```bash
mcp-doctor init
```

Run a named server from config:

```bash
mcp-doctor check --server echo
```

Export a Markdown report:

```bash
mcp-doctor check --server echo --markdown report.md
```

Export JSON:

```bash
mcp-doctor check --server echo --json
```

## Example config

```json
{
  "servers": {
    "echo": {
      "command": "node",
      "args": ["examples/echo-server.mjs"],
      "cwd": "."
    }
  }
}
```

## What mcp-doctor checks

| Check | Purpose |
|---|---|
| Connection | Verifies the server initializes through MCP. |
| Capabilities | Confirms capabilities are returned. |
| Tool catalog | Lists exposed tools. |
| Unique names | Detects duplicate tool names. |
| Name format | Warns about names outside a safe MCP-friendly pattern. |
| Descriptions | Warns when tool descriptions are missing or too short. |
| Input schemas | Verifies input schemas are objects and structurally sane. |
| Annotations | Warns about confusing side-effect metadata. |
| Security notes | Reminds maintainers about stdout hygiene and destructive tools. |

## Exit codes

- `0`: no failed checks.
- `1`: at least one failed check or the doctor run failed.

Warnings do not fail the command by default.

## Roadmap

- Streamable HTTP transport.
- Tool smoke tests with user-provided arguments.
- JSON Schema 2020-12 validation with detailed diagnostics.
- Resource and prompt inspection.
- GitHub Action mode.
- HTML report.
- Security profile for remote MCP servers.

## Documentation

- [English guide](docs/en/guide.md)
- [Guía en español](docs/es/guia.md)

## Author

Built by [Carlos Avila](https://github.com/AvilaCarlosDev) — Developer 🇻🇪

## License

MIT — see [LICENSE](LICENSE).
