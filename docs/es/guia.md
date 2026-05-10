# Guía de mcp-doctor 🩺

`mcp-doctor` es una CLI para diagnosticar servidores MCP antes de conectarlos a agentes de IA.

## Objetivo

Ayudar a developers y maintainers a responder rápido:

- ¿El servidor MCP inicia correctamente?
- ¿Expone tools?
- ¿Los nombres de tools son únicos y seguros?
- ¿Las descripciones ayudan al agente?
- ¿Los schemas están bien formados?
- ¿Hay advertencias de seguridad o de diseño?

## Instalación local

```bash
git clone https://github.com/AvilaCarlosDev/mcp-doctor.git
cd mcp-doctor
npm install
npm run build
```

## Uso rápido

```bash
npm run dev -- check --cmd node --args examples/echo-server.mjs
```

O usando configuración:

```bash
npm run dev -- init
npm run dev -- check --server echo
```

## Reportes

### Markdown

```bash
npm run dev -- check --server echo --markdown report.md
```

### JSON

```bash
npm run dev -- check --server echo --json
```

## Buenas prácticas MCP que revisa

1. **stdout limpio:** en servidores stdio, stdout debe reservarse para mensajes JSON-RPC. Los logs deben ir a stderr.
2. **Tools descriptivas:** los agentes toman mejores decisiones cuando cada tool explica claramente qué hace.
3. **Schemas claros:** `inputSchema` debe ser un objeto JSON Schema válido y entendible.
4. **Anotaciones honestas:** tools destructivas deben marcarse como destructivas; tools de solo lectura deben marcarse como read-only.
5. **Reportes reproducibles:** cada diagnóstico puede exportarse para compartir en issues, PRs o documentación.

## Filosofía

Este proyecto no busca reemplazar al MCP Inspector. Busca complementar el flujo con un diagnóstico rápido, automatizable y fácil de incluir en CI.
